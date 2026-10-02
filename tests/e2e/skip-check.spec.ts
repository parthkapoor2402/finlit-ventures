import { expect, test, type Page } from '@playwright/test'

async function startDecision(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /I'm about to change a SIP/ }).click()
}

async function chooseReason(page: Page, name: string) {
  await page.getByRole('radio', { name }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
}

async function fillAmounts(page: Page, current: string, proposed: string, months: string) {
  await page.getByLabel('Current monthly SIP').fill(current)
  await page.getByLabel('Monthly amount you are considering').fill(proposed)
  await page.getByLabel('Months to compare').fill(months)
  await page.getByRole('button', { name: 'See the comparison' }).click()
}

async function choose(page: Page, name: RegExp) {
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('radio', { name }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
}

async function passCheck(page: Page) {
  await page.getByRole('radio', { name: /contributions that would not be invested/ }).check()
  await page.getByRole('radio', { name: /Existing units stay invested/ }).check()
  await page.getByRole('button', { name: 'Show the recap' }).click()
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  ;(page as Page & { __errors?: string[] }).__errors = errors
})

test.afterEach(async ({ page }) => {
  const errors = (page as Page & { __errors?: string[] }).__errors ?? []
  expect(errors, errors.join('\n')).toEqual([])
})

test('a new user opens a decision session', async ({ page }) => {
  await startDecision(page)
  await expect(page.getByRole('heading', { name: /What's making you consider this change/ })).toBeVisible()
  await expect(page.getByText(/not registered with SEBI or AMFI/)).toBeVisible()
})

test('market worry can reduce a SIP', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Market worry')
  await fillAmounts(page, '12000', '6000', '6')
  await expect(page.getByText('₹36,000')).toBeVisible()
  await expect(page.getByText('Contributions that would not be invested over this period under these inputs.')).toBeVisible()
  await choose(page, /^Reduce/)
  await passCheck(page)
  await expect(page.getByRole('heading', { name: 'Your recap' })).toBeVisible()
  await expect(page.getByText('Market worry')).toBeVisible()
  await expect(page.getByText('₹36,000')).toBeVisible()
})

test('cash need can pause a SIP', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Cash need')
  await fillAmounts(page, '12000', '0', '6')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('radio', { name: /^Pause/ }).check()
  await expect(page.getByText(/Skip Check will not restart it/)).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await passCheck(page)
  await expect(page.getByText('Pause', { exact: true })).toBeVisible()
  await expect(page.getByText('₹72,000')).toBeVisible()
  await expect(page.getByText('Cash need')).toBeVisible()
})

test('keep leaves the contribution difference at zero', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Goal reached or near')
  await fillAmounts(page, '12000', '12000', '6')
  await expect(page.getByText('₹0')).toBeVisible()
  await choose(page, /^Keep/)
  await passCheck(page)
  await expect(page.getByText('Keep')).toBeVisible()
  await expect(page.getByText('₹0')).toBeVisible()
})

test('I am not sure does not add a recommendation', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, "I'm not sure")
  await fillAmounts(page, '9000', '3000', '3')
  await expect(page.getByText(/judge the market|you should/i)).toHaveCount(0)
  await choose(page, /^Reduce/)
  await passCheck(page)
  await expect(page.getByText("I'm not sure")).toBeVisible()
  await expect(page.getByText(/you should/i)).toHaveCount(0)
})

test('invalid amounts can be corrected', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Fund no longer fits')
  await page.getByLabel('Current monthly SIP').fill('-5')
  await page.getByRole('button', { name: 'See the comparison' }).click()
  await expect(page.getByRole('alert')).toContainText(/minus sign/)
  await page.getByLabel('Current monthly SIP').fill('10000')
  await page.getByLabel('Monthly amount you are considering').fill('2500')
  await page.getByLabel('Months to compare').fill('4')
  await page.getByRole('button', { name: 'See the comparison' }).click()
  await expect(page.getByText('₹30,000')).toBeVisible()
})

test('an amount above ₹10,00,000 stays hidden until the digits are confirmed', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Cash need')
  await fillAmounts(page, '1000001', '0', '6')
  await expect(page.getByRole('heading', { name: 'Check the digits' })).toBeVisible()
  await expect(page.getByText('Contributions that would not be invested over this period under these inputs.')).toHaveCount(0)
  await page.getByRole('button', { name: 'Change the amounts' }).click()
  await expect(page.getByText('₹60,00,006')).toHaveCount(0)
  await page.getByRole('button', { name: 'See the comparison' }).click()
  await page.getByRole('button', { name: 'These digits are right' }).click()
  await expect(page.getByText('₹60,00,006')).toBeVisible()
})

test('one month and twenty-four months both compare', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Market worry')
  await fillAmounts(page, '12000', '6000', '1')
  await expect(page.getByTestId('contribution-figure')).toContainText('₹6,000')
  await page.getByRole('button', { name: 'Back' }).click()
  await page.getByLabel('Months to compare').fill('24')
  await page.getByRole('button', { name: 'See the comparison' }).click()
  await expect(page.getByTestId('contribution-figure')).toContainText('₹1,44,000')
})

test('back navigation edits the proposed amount', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Market worry')
  await fillAmounts(page, '12000', '6000', '6')
  await expect(page.getByText('₹36,000')).toBeVisible()
  await page.getByRole('button', { name: 'Back' }).click()
  await page.getByLabel('Monthly amount you are considering').fill('8000')
  await page.getByRole('button', { name: 'See the comparison' }).click()
  await expect(page.getByText('₹24,000')).toBeVisible()
  await expect(page.getByText('₹36,000')).toHaveCount(0)
})

test('the comprehension check can be corrected', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Cash need')
  await fillAmounts(page, '12000', '6000', '6')
  await choose(page, /^Pause/)
  await page.getByRole('radio', { name: /a loss the change would cause/ }).check()
  await page.getByRole('radio', { name: /sells the units/ }).check()
  await page.getByRole('button', { name: 'Show the recap' }).click()
  await expect(page.getByRole('status')).toContainText(/not a loss/)
  await expect(page.getByText(/incorrect/i)).toHaveCount(0)
  await passCheck(page)
  await expect(page.getByRole('heading', { name: 'Your recap' })).toBeVisible()
})

test('the recap states the handoff', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Goal reached or near')
  await fillAmounts(page, '15000', '5000', '2')
  await choose(page, /^Reduce/)
  await passCheck(page)
  await expect(page.getByText('Any change has to be finished in your own investing app.')).toBeVisible()
  await expect(page.getByText(/not an order/)).toBeVisible()
  await expect(page.getByText('₹20,000')).toBeVisible()
})

test('the sample path is not a decision session', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /I'm only reading/ }).click()
  await expect(page.getByRole('note')).toContainText(/Illustrative sample/)
  await expect(page.getByText('₹36,000')).toBeVisible()
  await page.getByRole('button', { name: 'Leave without choosing' }).click()
  await page.getByText('Local counts in this tab').click()
  await expect(page.getByText('Decision sessions with a comparison: 0')).toBeVisible()
  await expect(page.getByText('Sample sessions opened: 1')).toBeVisible()
})

test('leaving before the recap is counted for a decision session', async ({ page }) => {
  await startDecision(page)
  await page.getByRole('button', { name: 'Leave without choosing' }).click()
  await page.getByText('Local counts in this tab').click()
  await expect(page.getByText('Left before the recap: 1')).toBeVisible()
  await expect(page.getByRole('heading', { name: /Before you change your SIP/ })).toBeVisible()
})

test('refresh clears amounts', async ({ page }) => {
  await startDecision(page)
  await chooseReason(page, 'Cash need')
  await page.getByLabel('Current monthly SIP').fill('12000')
  await page.reload()
  await expect(page.getByRole('heading', { name: /Before you change your SIP/ })).toBeVisible()
  await expect(page.getByLabel('Current monthly SIP')).toHaveCount(0)
})

test('a narrow viewport does not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await startDecision(page)
  await chooseReason(page, 'Market worry')
  await fillAmounts(page, '12000', '6000', '6')
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  )
  expect(overflows).toBe(false)
  await expect(page.getByText('₹36,000')).toBeVisible()
})

test('keyboard navigation completes a keep flow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect
    .poll(async () => page.evaluate(() => document.activeElement?.tagName))
    .toBe('H1')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: /I'm about to change a SIP/ })).toBeFocused()
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle)
  expect(outline).not.toBe('none')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: /What's making you consider this change/ })).toBeVisible()

  async function tabTo(locator: ReturnType<Page['getByRole']>) {
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const focused = await locator.evaluate((element) => element === document.activeElement)
      if (focused) return
      await page.keyboard.press('Tab')
    }
    throw new Error('Could not reach the control by keyboard')
  }

  await tabTo(page.getByRole('radio', { name: 'Cash need' }))
  await page.keyboard.press('Space')
  await tabTo(page.getByRole('button', { name: 'Continue' }))
  await page.keyboard.press('Enter')

  await tabTo(page.getByLabel('Current monthly SIP'))
  await page.keyboard.type('12000')
  await tabTo(page.getByLabel('Monthly amount you are considering'))
  await page.keyboard.type('12000')
  await tabTo(page.getByLabel('Months to compare'))
  await page.keyboard.type('6')
  await tabTo(page.getByRole('button', { name: 'See the comparison' }))
  await page.keyboard.press('Enter')
  await expect(page.getByText('₹0')).toBeVisible()

  await tabTo(page.getByRole('button', { name: 'Continue' }))
  await page.keyboard.press('Enter')
  await tabTo(page.getByRole('radio', { name: /^Keep/ }))
  await page.keyboard.press('Space')
  await tabTo(page.getByRole('button', { name: 'Continue' }))
  await page.keyboard.press('Enter')
  await tabTo(page.getByRole('radio', { name: /contributions that would not be invested/ }))
  await page.keyboard.press('Space')
  await tabTo(page.getByRole('radio', { name: /Existing units stay invested/ }))
  await page.keyboard.press('Space')
  await tabTo(page.getByRole('button', { name: 'Show the recap' }))
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Your recap' })).toBeVisible()
  await expect(page.getByText('Keep')).toBeVisible()
})
