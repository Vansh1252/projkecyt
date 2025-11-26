import React from 'react'
import type { QuoteData, UserInput } from '@/utils/type'
import { SETUP_TYPE_LABELS } from '@/utils/constants/constants'
// Note: CSS is inlined in the API route, so we don't import it here for SSR
// Note: Images are converted to base64 in the API route, so we use placeholders here

interface QuotePDFComponentProps {
  quote: QuoteData & { id: number }
  userInput: UserInput
}

export default function QuotePDFComponent({
  quote,
  userInput,
}: QuotePDFComponentProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Parse AI insights
  // const aiTips = quote.ai_tips ? JSON.parse(quote.ai_tips) : []
  // const aiExtraTips = quote.ai_extra_tips
  //   ? JSON.parse(quote.ai_extra_tips)
  //   : null
  const aiSanayTips = quote.ai_sanay_tips ? JSON.parse(quote.ai_sanay_tips) : []

  // Map services from quote data
  const mapServicesFromQuote = () => {
    const services: Array<{ name: string; cost: number }> = []
    const serviceMap: Record<string, { name: string; key: keyof QuoteData }> = {
      bk_cost: { name: 'Bookkeeping', key: 'bk_cost' },
      bku_cost: { name: 'Monthly Reporting Uplift', key: 'bku_cost' },
      pr_cost: { name: 'Payroll Processing', key: 'pr_cost' },
      vat_cost: { name: 'VAT Returns', key: 'vat_cost' },
      ma_cost: { name: 'Management Accounts', key: 'ma_cost' },
      fa_cost: { name: 'Final Accounts', key: 'fa_cost' },
      fcf_cost: { name: 'Forecasting', key: 'fcf_cost' },
      cfo_cost: { name: 'Fractional CFO', key: 'cfo_cost' },
      cc_cost: { name: 'Company Compliance', key: 'cc_cost' },
    }

    Object.entries(serviceMap).forEach(([_, { name, key }]) => {
      const cost = quote[key] as number | null
      if (cost !== null && cost !== undefined && cost > 0) {
        services.push({ name, cost })
      }
    })

    return services
  }

  const selectedServices = mapServicesFromQuote()
  const currentSetupMonthly = quote.current_setup_cost_annual / 12
  const hasSavings = quote.savings_annual > 0
  const efficiencyValue =
    quote.efficiency_index && quote.efficiency_index > 0
      ? quote.efficiency_index
      : 0

  return (
    <div className='pdf-container'>
      {/* Page 1: Cover Page */}
      <div className='paper-wrap' role='document' aria-label='Cover page'>
        <header className='header' role='banner'>
          <div className='logo-wrap' aria-hidden='true'>
            <img src='__IMAGE_GROUP_1__' alt='' className='img' />
          </div>
        </header>

        <section className='title-band' role='region' aria-label='Title block'>
          <h2>Your Intelligent Finance Proposal</h2>

          <div className='meta' role='group' aria-label='Prepared metadata'>
            <div className='meta-row'>
              <div className='meta-item'>
                <span className='label'>Prepared for:</span>
                <span>Yunchen Corporation Ltd</span>
              </div>

              <div className='meta-item'>
                <span className='label'>Date:</span>
                <span>18 November 2025</span>
              </div>

              <div className='meta-item'>
                <span className='label'>Prepared by:</span>
                <span>Sanay</span>
              </div>
            </div>
          </div>
        </section>

        <div className='images-section1'>
          <img src='__IMAGE_GROUP_2__' alt='success' className='arrow-shadow' />
        </div>

        <footer className='footer' role='contentinfo'>
          <div className='footer-last'>
            <div>Sanay - Intelligent Bookkeeping &amp; Finance Solutions</div>
            <div>www.sanaybpo.com</div>
          </div>
        </footer>
      </div>

      {/* Page 2: Executive Summary */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Executive Summary page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>2</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Executive Summary</h1>
            <p className='lead'>
              This proposal outlines a comprehensive, intelligent finance
              solution tailored specifically for{' '}
              {userInput.company_name || 'your business'}.
            </p>
            <p className='desc'>
              {quote.ai_summary ? (
                quote.ai_summary.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < quote.ai_summary.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              ) : (
                <>
                  Based on the information you provided — including your
                  business size (approx. {userInput.annual_turnover_band}{' '}
                  revenue), current setup (
                  {SETUP_TYPE_LABELS[userInput.current_setup] ||
                    userInput.current_setup}
                  ), and the services selected — this proposal outlines how
                  Sanay's Intelligent Finance Solution can help you automate,
                  simplify, and strengthen your finance operations.
                </>
              )}
            </p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              <div className='title' id='snapshot-title'>
                Your Results Snapshot
              </div>
              <div className='two-cols' style={{ marginTop: '6px' }}>
                <div className='stat'>
                  <div className='label'>Total Monthly Investment (Sanay)</div>
                  <div className='value'>
                    {formatCurrency(quote.sanay_cost_monthly)}
                  </div>
                </div>
                <div className='stat'>
                  <div className='label'>Your Current Finance Cost</div>
                  <div className='value'>
                    {formatCurrency(currentSetupMonthly)}
                  </div>
                </div>
              </div>
              <div className='big-cards'>
                <div className='big-card'>
                  <h5>Indicative Monthly Saving</h5>
                  <p>
                    {formatCurrency(hasSavings ? quote.savings_monthly : 0)}
                  </p>
                </div>
                <div className='big-card'>
                  <h5>Estimated Time Saved</h5>
                  <p>25 hrs/month</p>
                </div>
              </div>
            </div>
            <div className='spacer'></div>
          </div>
          <footer className='footer' role='contentinfo'>
            <div className='badge' role='complementary' aria-label='brand note'>
              <img src='__IMAGE_75__' alt='Sanay circular logo' />
              <div className='badge-text'>
                <strong>Intelligent Bookkeeping</strong> forms the foundation of
                your finance system — automating repetitive tasks, improving
                accuracy, and freeing your time for business growth.
              </div>
            </div>
            <div className='footer-last'>
              <div>Sanay - Intelligent Bookkeeping &amp; Finance Solutions</div>
              <div>www.sanaybpo.com</div>
            </div>
          </footer>
        </div>
      </div>

      {/* Page 3: Your Intelligent Bookkeeping Foundation */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Bookkeeping Foundation page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>3</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Your Intelligent Bookkeeping Foundation</h1>
            <p className='lead'>
              Intelligent Bookkeeping provides the data backbone of your finance
              function, combining automation, human oversight, and management
              reporting as standard.
            </p>
            <p>Feature</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Daily Processing</p>
                </div>
                <p>Automated bank feeds, reconciliations, and posting rules</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>AI Data Capture</p>
                </div>
                <p>
                  Automated extraction and categorisation of bills and receipts
                </p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Human Review Layer</p>
                </div>
                <p>UK team validates VAT, coding, and accuracy</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Automation & Alerts</p>
                </div>
                <p>AI detects anomalies and duplicates</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Monthly/Quarterly Reporting</p>
                </div>
                <p>Included as standard</p>
              </div>
              <div className='spacer'></div>
            </div>
            <footer className='footer' role='contentinfo'>
              <div
                className='badge'
                role='complementary'
                aria-label='brand note'
              >
                <p className='last'>
                  This foundation gives you fast, accurate data, ready for
                  management and forecasting insight.
                </p>
              </div>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 4: Your Selected Add-On Services */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Selected Services page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>4</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Your Selected Add-On Services</h1>
            <p className='lead'>
              These services expand your Intelligent Bookkeeping foundation into
              a complete Intelligent Finance Solution.
            </p>
            <p>Service</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              {selectedServices.map((service, idx) => (
                <div key={idx} className='main-pointer'>
                  <div className='first'>
                    <h3>{service.name}</h3>
                    <p>
                      {service.name === 'Payroll Processing' &&
                        'Up to 10 employees, monthly payroll run'}
                      {service.name === 'VAT Returns' &&
                        'Quarterly VAT submission & compliance'}
                      {service.name === 'Management Accounts' &&
                        'Monthly P&L, balance sheet & analysis'}
                      {service.name === 'Final Accounts' &&
                        'Annual accounts preparation & filing'}
                      {service.name === 'Forecasting' &&
                        'Budgeting & cashflow forecasting'}
                      {service.name === 'Fractional CFO' &&
                        'Strategic financial guidance & advisory'}
                      {service.name === 'Company Compliance' &&
                        'Company secretarial & compliance services'}
                      {![
                        'Payroll Processing',
                        'VAT Returns',
                        'Management Accounts',
                        'Final Accounts',
                        'Forecasting',
                        'Fractional CFO',
                        'Company Compliance',
                      ].includes(service.name) &&
                        'Professional service included'}
                    </p>
                  </div>
                  <div className='second'>
                    <h5>{formatCurrency(service.cost)}</h5>
                    <p>per month</p>
                  </div>
                </div>
              ))}
              <div className='spacer'></div>
            </div>
            <div className='badge' role='complementary' aria-label='brand note'>
              <div className=''>
                <h3>Flexible & Scalable</h3>
                <p className='last'>
                  You can add or remove services at any time with just 30 days'
                  notice. Our modular approach means you're never locked into
                  services you don't need.
                </p>
              </div>
              <img src='__IMAGE_GROUP_3__' alt='' />
            </div>
            <footer className='footer' role='contentinfo'>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 5: How Your Finance Function Can Evolve */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Finance Evolution page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>5</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>How Your Finance Function Can Evolve</h1>
            <p className='lead'>
              To illustrate how your finance system can scale as your business
              grows, here's how Sanay's Intelligent Finance framework progresses
              through each stage:
            </p>
            <div className='main-section'>
              <div className='somthing'>
                <h3>Intelligent Bookkeeping</h3>
                <p>
                  Accurate, streamlined bookkeeping to keep your financial
                  foundation in place. Up to 10 employees, monthly payroll run
                </p>
              </div>
            </div>
            <div className='images-section'>
              <img height='60px' src='__IMAGE_VECTOR_7__' alt='' />
            </div>
            <div className='main-section'>
              <div className='somthing'>
                <h3>Operational Layer</h3>
                <p>Everything runs smoothly in one place.</p>
                <div className='somthing-somthign'>
                  <div className='sommthing-new'>
                    <p>Payroll</p>
                  </div>
                  <div className='sommthing-new'>
                    <p>VAT Returns</p>
                  </div>
                  <div className='sommthing-new'>
                    <p>Management Reporting</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='images-section'>
              <img height='60px' src='__IMAGE_VECTOR_7__' alt='' />
            </div>
            <div className='main-section'>
              <div className='somthing'>
                <h3>Strategic Insight</h3>
                <p>Turn numbers into decisions.</p>
                <div className='somthing-somthign'>
                  <div className='sommthing-new'>
                    <p>Financial Analysis</p>
                  </div>
                  <div className='sommthing-new'>
                    <p>Budgeting & Forecasting</p>
                  </div>
                  <div className='sommthing-new'>
                    <p>Cash-flow Planning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='images-section'>
              <img height='60px' src='__IMAGE_VECTOR_7__' alt='' />
            </div>
            <div className='main-section'>
              <div className='somthing'>
                <h3>CFO-Level Advisory</h3>
                <p>Board-level finance partnership.</p>
                <div className='somthing-somthign'>
                  <div className='sommthing-new'>
                    <p>Part-time CFO</p>
                  </div>
                  <div className='sommthing-new'>
                    <p>Investor-ready reporting</p>
                  </div>
                  <div className='sommthing-new'>
                    <p>Growth strategy & funding support</p>
                  </div>
                </div>
              </div>
            </div>
            <footer className='footer' role='contentinfo'>
              <div
                className='badge'
                role='complementary'
                aria-label='brand note'
              >
                <p className='last'>
                  Each stage builds on the same foundation your data, your
                  systems, your insight growing seamlessly with your business.
                </p>
              </div>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 6: Other Services Available */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Other Services page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>6</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Other Services Available</h1>
            <p className='lead'>
              In addition to your selected services, we offer a comprehensive
              range of finance solutions that can be added at any time as your
              business needs evolve.
            </p>
            <div className='grid'>
              {[
                {
                  title: 'Payroll Processing',
                  desc: 'Monthly payroll runs, RTI submissions, pension auto-enrolment',
                },
                {
                  title: 'VAT Returns',
                  desc: 'Quarterly VAT submission & compliance',
                },
                {
                  title: 'Management Accounts',
                  desc: 'Monthly P&L, balance sheet & analysis',
                },
                {
                  title: 'Final Accounts',
                  desc: 'Annual accounts preparation & filing',
                },
                {
                  title: 'Forecasting',
                  desc: 'Budgeting & cashflow forecasting',
                },
                {
                  title: 'Financial Analysis',
                  desc: 'In-depth analysis of business performance',
                },
                {
                  title: 'CFO Advisory',
                  desc: 'Strategic financial guidance & advisory',
                },
              ].map((service, idx) => (
                <div key={idx} className='grid-box'>
                  <h4>{service.title}</h4>
                  <p>{service.desc}</p>
                </div>
              ))}
            </div>
            <footer className='footer' role='contentinfo'>
              <div
                className='badge'
                role='complementary'
                aria-label='brand note'
              >
                <p className='last'>
                  One unified finance system, scalable at your pace.
                </p>
              </div>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 7: Pricing Summary */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Pricing Summary page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>7</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Pricing Summary</h1>
            <p className='lead'>
              Your investment breakdown for the intelligent finance solution,
              with transparent pricing and flexible payment options.
            </p>
            <p>Service</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              {selectedServices.map((service, idx) => (
                <div key={idx} className='main-pointer'>
                  <div className='small'>
                    <img
                      width='20px'
                      height='20px'
                      src='__IMAGE_FRAME__'
                      alt=''
                    />
                    <p>{service.name}</p>
                  </div>
                  <p>{formatCurrency(service.cost)} per month</p>
                </div>
              ))}
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Total Monthly Cost</p>
                </div>
                <p>{formatCurrency(quote.sanay_cost_monthly)}</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Total Annual Cost</p>
                </div>
                <p>{formatCurrency(quote.sanay_cost_annual)}</p>
              </div>
              <div className='spacer'></div>
            </div>
            <div className='badge' role='complementary' aria-label='brand note'>
              <p className='last'>
                This foundation gives you fast, accurate data, ready for
                management and forecasting insight.
              </p>
            </div>
            <footer className='footer' role='contentinfo'>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 8: Cost & Efficiency Comparison */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Cost Comparison page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>8</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Cost & Efficiency Comparison</h1>
            <p className='lead'>
              See how Sanay's intelligent solution compares to your current
              finance setup in terms of cost, time, and capabilities.
            </p>
            <p>Service</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Current Setup Monthly Cost</p>
                </div>
                <p>{formatCurrency(currentSetupMonthly)}</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Sanay Monthly Cost</p>
                </div>
                <p>{formatCurrency(quote.sanay_cost_monthly)}</p>
              </div>
              {hasSavings && (
                <>
                  <div className='main-pointer'>
                    <div className='small'>
                      <img
                        width='20px'
                        height='20px'
                        src='__IMAGE_FRAME__'
                        alt=''
                      />
                      <p>Monthly Savings</p>
                    </div>
                    <p>{formatCurrency(quote.savings_monthly)}</p>
                  </div>
                  <div className='main-pointer'>
                    <div className='small'>
                      <img
                        width='20px'
                        height='20px'
                        src='__IMAGE_FRAME__'
                        alt=''
                      />
                      <p>Annual Savings</p>
                    </div>
                    <p>{formatCurrency(quote.savings_annual)}</p>
                  </div>
                </>
              )}
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Efficiency Index</p>
                </div>
                <p>{efficiencyValue.toFixed(0)}%</p>
              </div>
              <div className='spacer'></div>
            </div>
            <div className='badge' role='complementary' aria-label='brand note'>
              <p className='last'>
                This foundation gives you fast, accurate data, ready for
                management and forecasting insight.
              </p>
            </div>
            <footer className='footer' role='contentinfo'>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 9: How It Works */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='How It Works page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>9</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>How It Works</h1>
            <p className='lead'>Simple, Fast, Connected</p>
            <p>Service</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Daily Processing</p>
                </div>
                <p>Automated bank feeds, reconciliations, and posting rules</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>AI Data Capture</p>
                </div>
                <p>
                  Automated extraction and categorisation of bills and receipts
                </p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Human Review Layer</p>
                </div>
                <p>UK team validates VAT, coding, and accuracy</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Automation & Alerts</p>
                </div>
                <p>AI detects anomalies and duplicates</p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Monthly/Quarterly Reporting</p>
                </div>
                <p>Included as standard</p>
              </div>
              <div className='spacer'></div>
            </div>
            <div className='badge' role='complementary' aria-label='brand note'>
              <p className='last'>
                This foundation gives you fast, accurate data, ready for
                management and forecasting insight.
              </p>
            </div>
            <footer className='footer' role='contentinfo'>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 10: Why Sanay */}
      <div className='paper-wrap' role='document' aria-label='Why Sanay page'>
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>10</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Why Sanay</h1>
            <p className='lead'>
              Hundreds of growing businesses trust Sanay to handle their finance
              operations. Here's what sets us apart from traditional bookkeeping
              services.
            </p>
            <p>Service</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              {aiSanayTips.length > 0 ? (
                aiSanayTips.map((tip: string, idx: number) => (
                  <div key={idx} className='main-pointer'>
                    <div className='small'>
                      <img
                        width='20px'
                        height='20px'
                        src='__IMAGE_FRAME__'
                        alt=''
                      />
                      <p>Benefit {idx + 1}</p>
                    </div>
                    <p>{tip}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className='main-pointer'>
                    <div className='small'>
                      <img
                        width='20px'
                        height='20px'
                        src='__IMAGE_FRAME__'
                        alt=''
                      />
                      <p>Intelligent Automation</p>
                    </div>
                    <p>
                      AI-powered processes that reduce manual work and errors
                    </p>
                  </div>
                  <div className='main-pointer'>
                    <div className='small'>
                      <img
                        width='20px'
                        height='20px'
                        src='__IMAGE_FRAME__'
                        alt=''
                      />
                      <p>UK-Based Team</p>
                    </div>
                    <p>
                      Expert finance professionals who understand your business
                    </p>
                  </div>
                  <div className='main-pointer'>
                    <div className='small'>
                      <img
                        width='20px'
                        height='20px'
                        src='__IMAGE_FRAME__'
                        alt=''
                      />
                      <p>Scalable Solutions</p>
                    </div>
                    <p>Grow with your business without changing providers</p>
                  </div>
                </>
              )}
              <div className='spacer'></div>
            </div>
            <div className='badge' role='complementary' aria-label='brand note'>
              <p className='last'>
                This foundation gives you fast, accurate data, ready for
                management and forecasting insight.
              </p>
            </div>
            <footer className='footer' role='contentinfo'>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Page 11: Book Your Consultation */}
      <div
        className='paper-wrap'
        role='document'
        aria-label='Consultation page'
      >
        <div className='logo-row'>
          <div className='brand'>
            <img src='__IMAGE_GROUP_1__' alt='Sanay logo' />
            <p className='page-number'>11</p>
          </div>
        </div>
        <div className='hero'>
          <div className='main'>
            <h1>Book Your Consultation</h1>
            <p className='lead'>
              Ready to transform your finance operations? Let's discuss how
              Sanay can help your business achieve financial clarity and
              efficiency.
            </p>
            <p>Service</p>
            <div className='snapshot' aria-labelledby='snapshot-title'>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Review Your Quote</p>
                </div>
                <p>
                  Take time to review this comprehensive quote and understand
                  how Sanay can benefit your business.
                </p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Book a Consultation</p>
                </div>
                <p>
                  Schedule a call with our team to discuss your specific needs
                  and answer any questions you may have.
                </p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Onboarding Process</p>
                </div>
                <p>
                  Once you're ready, we'll guide you through a smooth onboarding
                  process to get started quickly.
                </p>
              </div>
              <div className='main-pointer'>
                <div className='small'>
                  <img
                    width='20px'
                    height='20px'
                    src='__IMAGE_FRAME__'
                    alt=''
                  />
                  <p>Start Saving</p>
                </div>
                <p>
                  Begin enjoying the benefits of professional financial
                  management and focus on growing your business.
                </p>
              </div>
              <div className='spacer'></div>
            </div>
            <div className='badge' role='complementary' aria-label='brand note'>
              <p className='last'>
                Quote ID: {quote.id} | Generated:{' '}
                {formatDate(new Date().toISOString())}
                <br />
                <br />
                <strong>Contact Us:</strong> info@sanay.co.uk | www.sanaybpo.com
                <br />
                <br />
                This quote is based on the information provided and is valid for
                30 days from the date of generation.
              </p>
            </div>
            <footer className='footer' role='contentinfo'>
              <div className='footer-last'>
                <div>
                  Sanay - Intelligent Bookkeeping &amp; Finance Solutions
                </div>
                <div>www.sanaybpo.com</div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
