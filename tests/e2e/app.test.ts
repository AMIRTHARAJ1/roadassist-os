import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';

describe('End-to-End Test for the App', function () {
  let driver: WebDriver;

  before(async function () {
    const options = new Options();
    // Run headless in CI or GitHub Actions
    if (process.env.CI) {
      options.addArguments('--headless=new');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
    }

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should load the app and display the main page', async function () {
    await driver.get('http://127.0.0.1:3000');
    
    // Wait for the body to be located
    await driver.wait(until.elementLocated(By.css('body')), 5000);
    
    // Check the page title
    const title = await driver.getTitle();
    expect(title).to.be.a('string');
    
    // Check if the #root element exists where React mounts
    const root = await driver.findElement(By.id('root'));
    expect(root).to.not.be.null;
  });
});
