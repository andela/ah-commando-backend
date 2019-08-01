const style = `
<<<<<<< HEAD
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  margin: auto;
  width: 70%;
  background: linear-gradient(#ffc700 40%, #fdfdfd 0);
  display: flex;
  height: 600px;
}

.button {
  text-align: center;
  color: white;
}

.link {
  padding: 10px 15px;
  text-decoration: none;
  text-transform: capitalize;
  font-size: medium;
  border-radius: 3px;
  color: rgb(255, 199, 0);
}

.mail-message {
  margin: auto;
  width: 60%;
  height: auto;
  min-height: 300px;
  padding: 50px 20px;
  background: white;
  text-align: left;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  font-weight: 100;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.mail-message h2 {
  margin-bottom: 30px;
  color: rgb(156, 156, 150);
  font-family: monaco;
  font-weight: 200;
  font-size: 25px;
  text-align: center;
}

.mail-message p {
  color: rgb(156, 156, 150);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  padding: 5px;
}

p+p {
  margin-bottom: 30px;
}

@media only screen and (max-width: 900px) {
  .mail-message h2 {
    font-size: 20px;
  }
}

@media only screen and (max-width: 500px) {
  .container {
    width: 100%;
  }

  .mail-message {
    width: 70%;
    padding: 50px 20px;
  }

  .mail-message h2 {
    font-size: 13px;
  }

  .mail-message p {
    font-size: 12px;
  }

  .link {
    font-size: 10px;
  }
}
=======
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .container {
    margin: auto;
    width: 100%;
    background: #fdfdfd;
    display: flex;
    height: 600px;
  }

  .button {
    text-align: center;
    color: white;
  }

  .link {
    padding: 10px 15px;
    text-decoration: none;
    text-transform: capitalize;
    font-size: medium;
    background: #348dda;
    border-radius: 3px;
    color: white;
  }

  .mail-message {
    margin: auto;
    width: 580px;
    height: 280px;
    padding: 50px 40px;
    background: white;
    text-align: left;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    font-weight: 100;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .mail-message h2 {
    margin-bottom: 30px;
    color: #526a80;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 200;
    font-size: 30px;
  }

  .mail-message p {
    margin-bottom: 50px;
    color: #526a80;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 20px;
  }
>>>>>>> feat(Email): Recieve verification notification
`;

export default style;
