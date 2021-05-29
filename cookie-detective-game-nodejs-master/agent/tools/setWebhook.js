/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//#!/usr/bin/node
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const get = require('lodash/get');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const YAML = require('yaml');
const config = require('../config/config.json');
const MAJOR_VERSION = require('../package.json').version.split('.')[0];

const WEBHOOK_URL_KEY = 'webhookUrl';
const DEFAULT_ENV = 'default';
const ENV_MAP = {
	dev: 'development',
	acc: 'acceptance',
	prod: 'production',
};

const projectId = fs
	.readFileSync(path.resolve(__dirname, '../../PROJECT_ID'))
	.toString()
	.trim();

if (!projectId) throw new Error(`Project ID not set in file PROJECT_ID`);

const env = ENV_MAP[args._[0]] || args._[0];
let webhookUrl = get(config, [env, WEBHOOK_URL_KEY]) || get(config, [DEFAULT_ENV, WEBHOOK_URL_KEY]);

if (!webhookUrl) throw new Error(`No webhook URL found for environment ${env}`);

webhookUrl = webhookUrl.replace(/{VERSION}/g, MAJOR_VERSION);

const tempDir = path.resolve(__dirname, '_temp/');

// eslint-disable-next-line no-console
console.log('Pulling agent config...');
rimraf.sync(tempDir);
mkdirp.sync(tempDir);

cp.execSync(`gactions pull --project-id ${projectId}`, { cwd: tempDir });

const webhookConfigFile = path.resolve(__dirname, '_temp/webhooks/AssistantStudioFulfillment.yaml');
const webhookConfigContent = fs.readFileSync(webhookConfigFile, 'utf8');
const webhookConfig = YAML.parse(webhookConfigContent);

if (webhookConfig.httpsEndpoint.baseUrl === webhookUrl) {
	// eslint-disable-next-line no-console
	console.log('Webhook URL already set.');
} else {
	webhookConfig.httpsEndpoint.baseUrl = webhookUrl;
	fs.writeFileSync(webhookConfigFile, YAML.stringify(webhookConfig));

	// eslint-disable-next-line no-console
	console.log('Pushing agent config...');
	cp.execSync(`gactions push`, { cwd: tempDir });

	// eslint-disable-next-line no-console
	console.log(`Webhook URL set to "${webhookUrl}" (${env})`);
}

rimraf.sync(tempDir);
