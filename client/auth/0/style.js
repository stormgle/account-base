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
  #container {
    margin: 16px;
  }
  hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 20px 0;
  }
  #panel {
    color: #616161;
  }
  #form {
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
    padding: 16px;
  }
  h3 {
    margin: 16px 0 0 0;
    padding: 8px;
    color: #fff;
    background-color: #3498db;
  }
  label {
    margin-top: 16px;
    color: #757575;
    display: block;
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
`

module.exports = style