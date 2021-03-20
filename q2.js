const puppeteer = require('puppeteer');

const width = 1024, height = 1600;

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width, height },

    });
    const page = await browser.newPage();
    await page.goto('https://app-dev.condoworks.co/');

    // Logging in
    await page.waitFor('input[name=Email]');
    await page.$eval('input[name=Email]', el => el.value = 'coop.test@condoworks.co');
    await page.$eval('input[name=Password]', el => el.value = 'MyTesting711');
    await page.click('input[type="submit"]');

    // Logged in, navigate to Invoices
    await page.waitFor('.nav-link')
    const invoices = await page.$x("//a[contains(., 'Invoices')]");
    await invoices[0].click();
    const all = await page.$x("//a[contains(., 'All')]");
    await all[0].click();

    // Navigating Invoices
    await page.waitFor('input[name=invoices\\.InvoiceNumber]')
    await page.$eval('input[name=invoices\\.InvoiceNumber]', el => el.value = '123');
    await page.waitFor('.fa-search') // check if icon is loaded to indicate link is loaded
    const view = await page.$$('[title="View/Edit"]');
    await view[1].click()

    // Downloading PDF
    await page.waitFor('.file-preview-pdf');
    var [el2] = await page.$x('//*[contains(@class, "file-preview-pdf")]');
    var src = await el2.getProperty('src');
    var link = await src._remoteObject.value.toString();

    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: "pdf"
    });

    try {
        await page.goto(link)
    } catch {
        void(0);
    }

    await page.waitFor(5000);

    // Final steps
    await browser.close();
    console.log(__dirname + "/InvoiceFile.pdf")
})();

