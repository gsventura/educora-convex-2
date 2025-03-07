export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Educora</h3>
            <p className="text-gray-600">
              AI-powered educational platform to help you excel in your exams.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900">
              Features
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>Question Generator</li>
              <li>Answer Assistant</li>
              <li>Saved Questions</li>
              <li>Study Plans</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-600 hover:text-gray-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Educora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
