"use strict"

const style = `
  html {
    margin: 0;
    padding: 0;
  }
  body {
    margin: 0px;
    font-family: Verdana,sans-serif;
    font-size: 15px;
    line-height: 1.5;
  }
  header {
    color: #fff;
    background-color: #3498db;
    padding: 16px;
  }
  h2 {
    margin: 0;
  }
  .container {
    margin: 16px;
  }
  hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 20px 0;
  }
  .intro {
    color: #616161;
  }
  .panel {
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
  }
  #form {
    
    padding: 32px 16px 32px 16px;
  }
  h3 {
    margin: 16px 0 0 0;
    padding: 8px;
    color: #fff;
    background-color: #3498db;
  }
  label {
    color: #757575;
    display: block;
    padding: 16px 0 16px 0;
  }
  input {
    border: 1px solid #ccc!important;
    padding: 8px 0 8px 4px;
    display: block;
    width: 100%;
    margin: 0;
    font: inherit;
  }
  button {
    color: #fff!important;
    background-color: #3498db;
    padding: 8px 16px;
    border: none;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    font: inherit;
    margin: 0;
  }
  .msg {
    margin: 8px 0 8px 0;
    height: 20px;
    position: relative;
    display: inline-block;
  }
  .bar {
    display: inline-block;
    position: relative;
  }
  #res {
    display: inline-block;
  }
  #msk {
    position: absolute;
    height: 20px;
    width: 100%;
    background-color: white;
    top: 0;
    right: 0;
  }
  .ind {
    height: 10px;
    width: 10px;
    display: inline-block;
    margin-right: 2px;
    border-radius: 25%;
  }
  .red {
    background-color: #f44336!important;
  }
  .orange {
    background-color: #ff9800!important;
  }
  .yellow {
    background-color: #ffeb3b!important;
  }
  .blue {
    background-color: #2196F3!important;
  }
  .green {
    background-color: #4CAF50!important;
  }
  #err {
    color: white;
  }
`

module.exports = style