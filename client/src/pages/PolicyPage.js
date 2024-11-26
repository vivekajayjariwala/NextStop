const policies = [
    {
        id: 1,
        title: 'Privacy',
        description:
          'Next Stop is committed to safeguarding your privacy and protecting your personal information. We only collect data necessary for account creation and site functionality, such as your email and preferences, ensuring that all data aligns with the Personal Information Protection and Electronic Documents Act (PIPEDA) standards. Your data is never shared with third parties without your consent, except where legally required. In the event of a takeover or dissolution, Next Stop will notify you of any changes to data handling practices, giving you control over your information.',
    },
    {
        id: 2,
        title: 'Security',
        description:
          'Next Stop values the confidentiality, integrity, and availability of your data. We use encryption protocols, such as SSL and JWT-based authentication, to secure data from unauthorized access, eavesdropping, and tampering. Regular security assessments are conducted to protect against breaches, ensuring compliance with industry standards. Access to the platform is restricted to authenticated users only, with protections against denial-of-service (DOS) attacks to maintain uninterrupted service for all users.',

    },
    {
        id: 3,
        title: 'Copyright',
        description:
          'Next Stop respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA) and Canada’s Notice and Notice system. Any copyrighted content uploaded must follow fair use guidelines and respect the rights of original creators. If you believe content on our platform infringes on your copyright, please contact us to initiate a takedown request. For flagged content, Next Stop will notify the contributor, and disputed content will be reinstated if the claimant does not pursue legal action within 14 days.',
    },
  ]

  export default function PolicyPage() {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Read our policies</h2>
            <p className="mt-4 text-lg text-gray-600">Take a look at our policies regarding privacy, security, and copyright.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-full grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:grid-cols-3">
              {policies.map((policy) => (
                  <article key={policy.id} className="flex flex-col items-start justify-between">
                  <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                          {policy.title}
                      </h3>
                      <p className="mt-5 text-sm text-gray-600">{policy.description}</p>
                  </div>
                  </article>
              ))}
          </div>
          <div className="mx-auto mt-16 border-t border-gray-200 pt-16">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <p className="mt-4 text-sm text-gray-600">
              For any notices of infringement or policy-related concerns, please contact us at:{' '}
              <a href="mailto:vjariwall@uwo.ca" className="text-blue-600 hover:text-blue-800">
                vjariwal@uwo.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    )
}