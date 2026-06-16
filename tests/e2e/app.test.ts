import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';

describe('End-to-End Test for the App (20 Test Cases)', function () {
  let driver: WebDriver;

  before(async function () {
    this.timeout(60000); // 60 seconds timeout for Chrome to download/initialize
    const options = new Options();
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

  // ========== CORE UI & LOGIN (8 Tests) ==========
  it('1. should load the app and display the main page', async function () {
    await driver.get('http://127.0.0.1:3000');
    await driver.wait(until.elementLocated(By.css('body')), 5000);
    const root = await driver.findElement(By.id('root'));
    expect(root).to.not.be.null;
  });

  it('2. should display the RoadAssist OS header', async function () {
    const header = await driver.findElement(By.xpath("//h1[contains(text(), 'RoadAssist OS')]"));
    expect(header).to.not.be.null;
  });

  it('3. should contain the Login Module by default', async function () {
    const loginHeader = await driver.findElement(By.xpath("//h2[contains(text(), 'Secure Dispatch Access')]"));
    expect(loginHeader).to.not.be.null;
  });

  it('4. should have an input for Name', async function () {
    const nameInput = await driver.findElement(By.xpath("//input[@placeholder='e.g. Rajesh Kumar']"));
    expect(nameInput).to.not.be.null;
  });

  it('5. should have an input for Email', async function () {
    const emailInput = await driver.findElement(By.xpath("//input[@type='email']"));
    expect(emailInput).to.not.be.null;
  });

  it('6. should have a Role selection dropdown', async function () {
    const roleSelect = await driver.findElement(By.tagName('select'));
    expect(roleSelect).to.not.be.null;
  });

  it('7. should have an Access Secure System login button', async function () {
    const loginBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Access Secure System')]"));
    expect(loginBtn).to.not.be.null;
  });

  it('8. should have an About Research Project link in header', async function () {
    const aboutBtn = await driver.findElement(By.xpath("//button[contains(text(), 'About Research Project')]"));
    expect(aboutBtn).to.not.be.null;
  });


  // ========== CUSTOMER DASHBOARD (4 Tests) ==========
  it('9. should login as a Customer successfully', async function () {
    await driver.findElement(By.xpath("//input[@placeholder='e.g. Rajesh Kumar']")).sendKeys('Test Customer');
    await driver.findElement(By.xpath("//input[@type='email']")).sendKeys('customer@test.com');
    await driver.findElement(By.tagName('select')).sendKeys('customer');
    await driver.findElement(By.xpath("//button[contains(text(), 'Access Secure System')]")).click();
    
    // Wait for dashboard to load
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Welcome back')]")), 5000);
  });

  it('10. should display the Welcome back greeting', async function () {
    const greeting = await driver.findElement(By.xpath("//h1[contains(text(), 'Welcome back, Test Customer')]"));
    expect(greeting).to.not.be.null;
  });

  it('11. should display Live Operations Map', async function () {
    const map = await driver.findElement(By.xpath("//h3[contains(text(), 'Live Operations Map')]"));
    expect(map).to.not.be.null;
  });

  it('12. should display Request Emergency Service button', async function () {
    const reqBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Request Emergency Service')]"));
    expect(reqBtn).to.not.be.null;
  });


  // ========== MECHANIC PORTAL (4 Tests) ==========
  it('13. should logout and return to login screen', async function () {
    await driver.findElement(By.css('button[title="Sign Out Session"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Secure Dispatch Access')]")), 5000);
  });

  it('14. should login as a Mechanic successfully', async function () {
    await driver.findElement(By.xpath("//input[@placeholder='e.g. Rajesh Kumar']")).sendKeys('Test Mechanic');
    await driver.findElement(By.xpath("//input[@type='email']")).sendKeys('mechanic@test.com');
    await driver.findElement(By.tagName('select')).sendKeys('mechanic');
    await driver.findElement(By.xpath("//button[contains(text(), 'Access Secure System')]")).click();
    
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Standby Technician Desk')]")), 5000);
  });

  it('15. should display Standby Technician Desk header', async function () {
    const header = await driver.findElement(By.xpath("//h1[contains(text(), 'Standby Technician Desk')]"));
    expect(header).to.not.be.null;
  });

  it('16. should display Incoming Dispatch Pings section', async function () {
    const pings = await driver.findElement(By.xpath("//h2[contains(text(), 'Incoming Dispatch Pings')]"));
    expect(pings).to.not.be.null;
  });


  // ========== ADMIN DASHBOARD (4 Tests) ==========
  it('17. should logout from mechanic portal', async function () {
    await driver.findElement(By.css('button[title="Sign Out Session"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Secure Dispatch Access')]")), 5000);
  });

  it('18. should login as an Admin successfully', async function () {
    await driver.findElement(By.xpath("//input[@placeholder='e.g. Rajesh Kumar']")).sendKeys('Test Admin');
    await driver.findElement(By.xpath("//input[@type='email']")).sendKeys('admin@test.com');
    await driver.findElement(By.tagName('select')).sendKeys('admin');
    await driver.findElement(By.xpath("//button[contains(text(), 'Access Secure System')]")).click();
    
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'System Overview')]")), 5000);
  });

  it('19. should display System Overview statistics panel', async function () {
    const overview = await driver.findElement(By.xpath("//h1[contains(text(), 'System Overview')]"));
    expect(overview).to.not.be.null;
  });

  it('20. should display Active Incidents list', async function () {
    const incidents = await driver.findElement(By.xpath("//h2[contains(text(), 'Active Incidents')]"));
    expect(incidents).to.not.be.null;
  });

});
