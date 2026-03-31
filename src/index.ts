#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import App from './app.js';
import { loadEnv } from './utils/config.js';

// Load environment variables from .env
loadEnv();

// Render the app
render(React.createElement(App));
