'use strict';

import chalk from 'chalk';
import mongoose from './mongoose';
import express from './express';
import config from 'config/config';


function start() {

  let db = new Promise(function (resolve, reject) {
    mongoose
      .loadModels()
      .then(mongoose.connect)
      .then(mongoose.seed)
      .then(function () {
        console.log(chalk.bold.cyan('Mongoose::Done::Success'));
        resolve();
      })
      .catch(function (err) {
        console.log(chalk.bold.red('Mongoose::Done::Error'));
        console.log(chalk.bold.red(err));
        reject();
      });
  });

  let server = new Promise(function (resolve, reject) {
    express.init()
      .then(express.variables)
      .then(express.middleware)
      .then(express.engine)
      .then(express.headers)
      .then(express.moduleconfig)
      .then(express.policies)
      .then(express.routes)
      .then(express.listen)
      .then(function (app) {
        console.log(chalk.bold.cyan('Express::Done::Success'));
        resolve(app);
      })
      .catch(function (err) {
        console.log(chalk.bold.red('Express::Done::Error'));
        console.log(chalk.bold.red(err));
      });
  });

  return Promise.all([db, server]);
}

let app = {
  start: start
};

module.exports = app;