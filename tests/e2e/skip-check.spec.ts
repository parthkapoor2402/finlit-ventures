import { expect, test, type Page } from '@playwright/test'

async function start(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explore my options' }).click()
}

test('assessment compares ₹12,000 and ₹6,000 over six months', async ({ page }) => {
  await start(page)
  await expect(page.getByText(/not registered with SEBI or AMFI/).first()).toBeVisible()
  await page.getByRole('radio', { name: /My expenses or priorities have changed/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Current monthly SIP').fill('12000')
  await page.getByLabel('What monthly amount are you considering?').fill('6000')
  await page.getByLabel('Duration in months').fill('6')
  await page.getByRole('button', { name: 'See the numbers' }).click()
  await expect(page.getByRole('heading', { name: 'Keep' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reduce' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Pause' })).toBeVisible()
  await expect(page.getByText('₹36,000 less in planned contributions over this period.')).toBeVisible()
  await expect(page.getByText(/not an investment loss/i)).toBeVisible()
  await page.getByRole('button', { name: 'Skip for now' }).click()
  await expect(page.getByRole('heading', { name: 'Here’s what you explored.' })).toBeVisible()
  await expect(page.getByText(/has not changed your SIP/i)).toBeVisible()
  await page.getByRole('button', { name: 'Finish for now' }).click()
  await expect(page.getByText(/without chatting, saving, or setting a reminder/i)).toBeVisible()
})

test('an increase stays outside the assessment', async ({ page }) => {
  await start(page)
  await page.getByRole('radio', { name: /I’m still figuring things out/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Current monthly SIP').fill('8000')
  await page.getByLabel('What monthly amount are you considering?').fill('9000')
  await page.getByRole('button', { name: 'See the numbers' }).click()
  await expect(page.getByRole('alert')).toContainText(/outside this assessment/i)
})

test('a saved recap can be deleted', async ({ page }) => {
  await start(page)
  await page.getByRole('radio', { name: /My income or expenses have changed/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Current monthly SIP').fill('5000')
  await page.getByLabel('What monthly amount are you considering?').fill('0')
  await page.getByLabel('Duration in months').fill('3')
  await page.getByRole('button', { name: 'See the numbers' }).click()
  await page.getByRole('button', { name: 'Skip for now' }).click()
  await page.getByRole('checkbox', { name: /Save this recap/ }).check()
  await page.getByRole('button', { name: 'Save my recap' }).click()
  await page.getByRole('button', { name: 'Back to the start' }).click()
  await expect(page.getByText(/₹15,000 less in planned contributions/)).toBeVisible()
  await page.getByRole('button', { name: 'Delete this recap' }).click()
  await expect(page.getByText(/₹15,000 less in planned contributions/)).toHaveCount(0)
})

test('the sample opens without personal amounts', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'I’m just exploring' }).click()
  await expect(page.getByRole('heading', { name: 'Keep' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Pause' })).toBeVisible()
  await expect(page.getByText(/not your SIP/i)).toBeVisible()
})
