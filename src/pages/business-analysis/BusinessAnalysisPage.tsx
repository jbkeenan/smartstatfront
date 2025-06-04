import React, { useState } from 'react';
import Layout from '../../components/shared/Layout';

const BusinessAnalysisPage: React.FC = () => {
  const [propertyCount, setPropertyCount] = useState<number>(1);
  const [avgMonthlyBill, setAvgMonthlyBill] = useState<number>(150);
  const [hvacPercentage, setHvacPercentage] = useState<number>(50);
  const [savingsPercentage, setSavingsPercentage] = useState<number>(30);

  // Calculate monthly and annual savings
  const monthlySavings = (avgMonthlyBill * (hvacPercentage / 100) * (savingsPercentage / 100)) * propertyCount;
  const annualSavings = monthlySavings * 12;
  const monthlySubscriptionCost = 9.99 * propertyCount;
  const annualSubscriptionCost = monthlySubscriptionCost * 12;
  const netAnnualSavings = annualSavings - annualSubscriptionCost;
  const roi = (netAnnualSavings / annualSubscriptionCost) * 100;

  return (
    <Layout>
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Smart Thermostat Business Analysis</h1>
        <p className="mt-2 max-w-4xl text-lg text-gray-500">
          See how our automation system can save you money and reduce energy waste
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900">Why Your Thermostat Automation SaaS Is So Good</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-blue-700">1. It Solves a Real, Costly Problem for Hosts</h3>
            <p>
              Airbnb and short-term rental hosts bleed money when HVAC systems run unnecessarily between guests.
              Manual control is unreliable. Cleaning crews forget. Guests check in early. AC runs for hours for no reason.
              Your system automates this — saving energy, money, and frustration without human error.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">2. It Works Across Brands and Scales</h3>
            <p>
              Hosts often own multiple thermostat types (Nest, Cielo, Pioneer, etc.).
              Your platform normalizes control across all brands in one dashboard.
              This is exactly what property managers with 10+ units need — centralized, brand-agnostic automation.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">3. It Ties Directly to the Booking Calendar</h3>
            <p>
              Google Calendar + iCal parsing for check-ins/check-outs = zero guesswork.
              Your system sets temperatures before guests arrive and after they leave, automatically.
              Hosts can customize "pre-arrival" and "post-checkout" windows to optimize comfort and cost.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">4. It Saves Money and Pays for Itself</h3>
            <p>
              HVAC is often 40–60% of an Airbnb host's utility bill.
              Your system can easily save $20–50/month/unit or more.
              That means your SaaS pays for itself in 1 property, and generates net ROI with just 2–3 listings.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">5. It's Green, Which Sells</h3>
            <p>
              Energy-saving = lower carbon footprint.
              You're not just saving hosts money — you're helping reduce energy waste.
              This gives you a clean tech angle that Airbnb, Vrbo, and eco-conscious travelers value.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">6. It Lends Itself to Smart Upsells</h3>
            <p>
              You can layer in: usage reports, cost calculators, temperature alerts, multi-property analytics.
              Smart controls for guests? Owner overrides? Seasonal presets?
              Add-ons = more MRR without raising your base price.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">7. It's Technically Viable Today</h3>
            <p>
              APIs already exist for Nest, Cielo, and Google Calendar.
              Python + Django + a React frontend can power this easily.
              It can be deployed affordably on Render or Fly.io — no $10k cloud bills needed to start.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">8. Market Is Growing and Fragmented</h3>
            <p>
              STR automation tools (like OwnerRez, Hospitable) don't do this well — or at all.
              Smart thermostat manufacturers only support their own devices, with no real scheduling intelligence.
              You sit in a sweet spot: cross-brand, calendar-driven, scalable control.
            </p>

            <h3 className="text-lg font-medium text-blue-700 mt-6">Summary</h3>
            <p>
              You're creating an automation layer that's desperately needed, technically feasible, and financially valuable — in an exploding market full of inefficiencies.
              You're not just making it easier to control thermostats — you're removing the need to even think about them.
            </p>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-green-50">
          <h2 className="text-xl font-semibold text-gray-900">ROI Calculator</h2>
          <p className="mt-1 text-sm text-gray-500">
            Calculate your potential savings with our Smart Thermostat Automation System
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Input Your Information</h3>
              
              <div className="mb-4">
                <label htmlFor="property-count" className="block text-sm font-medium text-gray-700">
                  Number of Properties
                </label>
                <input
                  type="number"
                  id="property-count"
                  min="1"
                  max="100"
                  value={propertyCount}
                  onChange={(e) => setPropertyCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="avg-bill" className="block text-sm font-medium text-gray-700">
                  Average Monthly Utility Bill ($)
                </label>
                <input
                  type="number"
                  id="avg-bill"
                  min="0"
                  step="10"
                  value={avgMonthlyBill}
                  onChange={(e) => setAvgMonthlyBill(Math.max(0, parseInt(e.target.value) || 0))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="hvac-percentage" className="block text-sm font-medium text-gray-700">
                  HVAC Percentage of Bill (%)
                </label>
                <input
                  type="range"
                  id="hvac-percentage"
                  min="10"
                  max="90"
                  step="5"
                  value={hvacPercentage}
                  onChange={(e) => setHvacPercentage(parseInt(e.target.value))}
                  className="mt-1 block w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{hvacPercentage}%</div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="savings-percentage" className="block text-sm font-medium text-gray-700">
                  Estimated Savings (%)
                </label>
                <input
                  type="range"
                  id="savings-percentage"
                  min="10"
                  max="50"
                  step="5"
                  value={savingsPercentage}
                  onChange={(e) => setSavingsPercentage(parseInt(e.target.value))}
                  className="mt-1 block w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{savingsPercentage}%</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Estimated Savings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md shadow">
                  <div className="text-sm text-gray-500">Monthly Savings</div>
                  <div className="text-2xl font-bold text-green-600">${monthlySavings.toFixed(2)}</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow">
                  <div className="text-sm text-gray-500">Annual Savings</div>
                  <div className="text-2xl font-bold text-green-600">${annualSavings.toFixed(2)}</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow">
                  <div className="text-sm text-gray-500">Monthly Subscription</div>
                  <div className="text-2xl font-bold text-blue-600">${monthlySubscriptionCost.toFixed(2)}</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow">
                  <div className="text-sm text-gray-500">Annual Subscription</div>
                  <div className="text-2xl font-bold text-blue-600">${annualSubscriptionCost.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="mt-6 bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Net Annual Savings</div>
                    <div className="text-3xl font-bold text-green-600">${netAnnualSavings.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">ROI</div>
                    <div className="text-3xl font-bold text-green-600">{roi.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900">Feature Comparison</h2>
          <p className="mt-1 text-sm text-gray-500">
            See how our solution compares to alternatives
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Smart Thermostat Automation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Native Thermostat Apps
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Management Software
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Cross-brand compatibility
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-green-600">✓ All major brands</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ Single brand only</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ Limited or none</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Calendar integration
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-green-600">✓ Direct integration</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ Manual scheduling only</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-yellow-600">~ Limited functionality</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Automated check-in/out control
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-green-600">✓ Fully automated</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ Manual only</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ Not available</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Multi-property dashboard
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-green-600">✓ Centralized control</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-yellow-600">~ Limited functionality</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ No thermostat control</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Energy savings analytics
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-green-600">✓ Comprehensive</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-yellow-600">~ Basic</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-600">✗ Not available</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700 shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-12 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to start saving?</span>
                <span className="block">Get started today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-blue-100">
                Join property owners across the country who are saving money and reducing energy waste with our Smart Thermostat Automation System.
              </p>
              <div className="mt-8 flex">
                <div className="inline-flex rounded-md shadow">
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                  >
                    Sign up for free
                  </a>
                </div>
                <div className="ml-3 inline-flex">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Contact sales
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
                <div className="relative bg-white p-6 sm:rounded-lg shadow-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Start saving with our basic plan</h3>
                    <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold text-gray-900">
                      $9.99
                      <span className="ml-1 text-xl font-medium text-gray-500">/mo per property</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      No contracts. Cancel anytime.
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="rounded-md shadow">
                      <a
                        href="/register"
                        className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Get started
                      </a>
                    </div>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">Unlimited thermostats per property</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">Calendar integration</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">Basic energy savings reports</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessAnalysisPage;
