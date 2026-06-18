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
    // Wait for the React app to render the login module
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Sign In')]")), 5000);
    const root = await driver.findElement(By.id('root'));
    expect(root).to.not.be.null;
  });

  it('2. should display the RoadAssist OS header', async function () {
    const header = await driver.findElement(By.xpath("//h1[contains(text(), 'RoadAssist OS')]"));
    expect(header).to.not.be.null;
  });

  it('3. should contain the Login Module by default', async function () {
    const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
    expect(btn).to.not.be.null;
  });

  it('4. should have an input for Email', async function () {
    const email = await driver.findElement(By.xpath("//input[@type='email']"));
    expect(email).to.not.be.null;
  });

  it('5. should have an input for Password', async function () {
    const password = await driver.findElement(By.xpath("//input[@type='password']"));
    expect(password).to.not.be.null;
  });

  it('6. should have Role selection buttons', async function () {
    const mechanicRole = await driver.findElement(By.xpath("//button[contains(text(), 'Mechanic Link')]"));
    expect(mechanicRole).to.not.be.null;
  });

  it('7. should have an Secure Authenticate login button', async function () {
    const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Secure Authenticate')]"));
    expect(submitBtn).to.not.be.null;
  });

  it('8. should have an About Research Project link in header', async function () {
    const projectLink = await driver.findElement(By.xpath("//button[contains(text(), 'About Research Project')]"));
    expect(projectLink).to.not.be.null;
  });


  // ========== CUSTOMER DASHBOARD (4 Tests) ==========
  it('9. should login as a Customer successfully', async function () {
    // Select Customer role
    await driver.findElement(By.xpath("//button[contains(text(), 'Customer')]")).click();
    // Fill credentials
    await driver.findElement(By.xpath("//input[@type='email']")).sendKeys('customer@roadassist.org');
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys('customer123');
    // Submit
    await driver.findElement(By.xpath("//button[contains(text(), 'Secure Authenticate')]")).click();
    
    // Wait for dashboard to load
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'On-Road Vehicle Breakdown Detection')]")), 5000);
  });

  it('10. should display the active user name greeting', async function () {
    const greeting = await driver.findElement(By.xpath("//h3[contains(text(), 'Test Customer')]"));
    expect(greeting).to.not.be.null;
  });

  it('11. should display Average ETA metric', async function () {
    const map = await driver.findElement(By.xpath("//span[contains(text(), 'Avg ETA')]"));
    expect(map).to.not.be.null;
  });

  it('12. should display distress SOS trigger button', async function () {
    const reqBtn = await driver.findElement(By.xpath("//button[contains(., 'Trigger Distress SOS')]"));
    expect(reqBtn).to.not.be.null;
  });


  // ========== MECHANIC PORTAL (4 Tests) ==========
  it('13. should logout and return to login screen', async function () {
    await driver.findElement(By.css('button[title="Sign Out Session"]')).click();
    // Wait for the Login Module to mount
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Sign In')]")), 5000);
  });

  it('14. should login as a Mechanic successfully', async function () {
    // Select Mechanic role
    await driver.findElement(By.xpath("//button[contains(text(), 'Mechanic Link')]")).click();
    // Fill credentials
    await driver.findElement(By.xpath("//input[@type='email']")).sendKeys('mechanic.rajesh@roadassist.org');
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys('mech123');
    // Submit
    await driver.findElement(By.xpath("//button[contains(text(), 'Secure Authenticate')]")).click();
    
    await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Technician Fleet Link')]")), 5000);
  });

  it('15. should display Connected Dispatch Stream header', async function () {
    const header = await driver.findElement(By.xpath("//h2[contains(text(), 'Connected Dispatch Stream')]"));
    expect(header).to.not.be.null;
  });

  it('16. should display Ready for Dispatch radio state', async function () {
    const pings = await driver.findElement(By.xpath("//span[contains(text(), 'Ready for Dispatch')]"));
    expect(pings).to.not.be.null;
  });


  // ========== ADMIN DASHBOARD (4 Tests) ==========
  it('17. should logout from mechanic portal', async function () {
    await driver.findElement(By.css('button[title="Sign Out Session"]')).click();
    // Wait for the Login Module to mount
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Sign In')]")), 5000);
  });

  it('18. should login as an Admin successfully', async function () {
    // Select Admin role
    await driver.findElement(By.xpath("//button[contains(text(), 'Control Desk')]")).click();
    // Fill credentials
    await driver.findElement(By.xpath("//input[@type='email']")).sendKeys('admin@roadassist.org');
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys('admin123');
    // Submit
    await driver.findElement(By.xpath("//button[contains(text(), 'Secure Authenticate')]")).click();
    
    await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Master Control Admin')]")), 5000);
  });

  it('19. should display Assistance Performance header', async function () {
    const panel = await driver.findElement(By.xpath("//h2[contains(text(), 'Assistance Performance')]"));
    expect(panel).to.not.be.null;
  });

  it('20. should display Active System Alert Register', async function () {
    const list = await driver.findElement(By.xpath("//h3[contains(text(), 'Active System Alert Register')]"));
    expect(list).to.not.be.null;
  });

});
