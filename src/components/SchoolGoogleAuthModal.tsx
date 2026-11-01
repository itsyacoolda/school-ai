import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Globe, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertTriangle, 
  GraduationCap, 
  Users, 
  Settings, 
  Lock, 
  ArrowRight,
  School
} from 'lucide-react';
import { StudentProfile, GoogleAccountInfo } from '../types';

interface SchoolGoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkGoogleAccount?: (googleInfo: GoogleAccountInfo) => void;
  currentProfile?: StudentProfile;
}

export const SchoolGoogleAuthModal: React.FC<SchoolGoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLinkGoogleAccount,
  currentProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'simulate' | 'env'>('guide');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Simulation inputs
  const [testEmail, setTestEmail] = useState(
    currentProfile ? `${currentProfile.fullName.toLowerCase().replace(/\s+/g, '.')}@indigenous-school.edu` : 'aarav.patel@indigenous-school.edu'
  );
  const [domainWarning, setDomainWarning] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSimulatedConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setDomainWarning('');
    setSuccessMsg('');

    const email = testEmail.trim().toLowerCase();
    if (!email.includes('@')) {
      setDomainWarning('Please enter a valid school email address.');
      return;
    }

    const domain = email.split('@')[1];
    // Reject common personal domains to educate the user
    if (domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'hotmail.com' || domain === 'outlook.com') {
      setDomainWarning(
        `Personal accounts (@${domain}) are blocked by Google Workspace security policy. You must use a school-managed domain (e.g. @indigenous-school.edu or your school's .edu / .ac.in / .org domain).`
      );
      return;
    }

    const simulatedAccount: GoogleAccountInfo = {
      email,
      hd: domain,
      name: currentProfile?.fullName || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      verifiedSchoolAccount: true,
      sub: `gsuite-${Date.now()}`,
    };

    if (onLinkGoogleAccount) {
      onLinkGoogleAccount(simulatedAccount);
    }
    setSuccessMsg(`Successfully authenticated and linked with verified school account: ${email}`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 border border-white/15">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif flex items-center gap-2">
                Connecting School-Managed Google Accounts
              </h2>
              <p className="text-xs text-emerald-200">
                Google Workspace for Education & Single Sign-On (SSO) Integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Step-by-Step IT Admin Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulate'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Link / Test School Account</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'env'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Production Config (.env)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 text-xs leading-relaxed">
          
          {activeTab === 'guide' && (
            <div className="space-y-6">
              
              {/* Executive Summary */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  How School Google Authentication Works
                </div>
                <p className="text-xs text-emerald-800">
                  School-managed accounts use <strong>Google Workspace for Education</strong>. When students or faculty sign in with their official email (e.g. <code className="bg-emerald-100/80 px-1 py-0.5 rounded text-[11px] font-mono">student@indigenous-school.edu</code>), Google verifies their identity and returns a secure token with their verified domain (<code className="bg-emerald-100/80 px-1 py-0.5 rounded text-[11px] font-mono">hd</code>). Personal Gmail accounts (<code className="bg-emerald-100/80 px-1 py-0.5 rounded text-[11px] font-mono">@gmail.com</code>) are automatically rejected.
                </p>
              </div>

              {/* Step 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Create OAuth 2.0 Client in Google Cloud Console</span>
                  </div>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 hover:underline flex items-center gap-1 text-[11px] font-medium"
                  >
                    <span>console.cloud.google.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                  <li>Log in to Google Cloud Console with your <strong>School IT Administrator</strong> Google account.</li>
                  <li>Create a new project named <strong>&quot;Indigenous School AI Portal&quot;</strong>.</li>
                  <li>Navigate to <strong>APIs &amp; Services &gt; OAuth consent screen</strong>.</li>
                  <li>Select User Type: <strong>Internal</strong> (This guarantees ONLY users in your school&apos;s Google Workspace domain can ever sign in).</li>
                  <li>Navigate to <strong>Credentials &gt; Create Credentials &gt; OAuth client ID</strong>.</li>
                  <li>Select Application Type: <strong>Web application</strong>.</li>
                  <li>Add your app domain under <strong>Authorized JavaScript origins</strong>:
                    <div className="mt-1 flex items-center justify-between bg-slate-100 p-2 rounded-lg font-mono text-[11px] text-slate-800 border border-slate-200">
                      <span>{window.location.origin}</span>
                      <button
                        onClick={() => copyToClipboard(window.location.origin, 'origin')}
                        className="text-slate-500 hover:text-slate-800 p-1 cursor-pointer"
                        title="Copy Origin"
                      >
                        {copiedSection === 'origin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Enforce School Hosted Domain (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">hd</code> parameter)</span>
                </div>
                <p className="text-slate-600">
                  To ensure personal <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">@gmail.com</code> accounts are blocked at the Google login prompt, the Google Identity Services (GIS) client specifies the school domain:
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto relative">
                  <button
                    onClick={() => copyToClipboard(`google.accounts.id.initialize({\n  client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',\n  hosted_domain: 'indigenous-school.edu', // Enforces school domain\n  callback: handleGoogleCredentialResponse\n});`, 'code-hd')}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white p-1"
                    title="Copy code"
                  >
                    {copiedSection === 'code-hd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre>{`google.accounts.id.initialize({
  client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  hosted_domain: 'indigenous-school.edu', // Enforces school domain
  callback: handleGoogleCredentialResponse
});`}</pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Google Workspace Admin Console Whitelist</span>
                  </div>
                  <a
                    href="https://admin.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 hover:underline flex items-center gap-1 text-[11px] font-medium"
                  >
                    <span>admin.google.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-600">
                  School admins should trust the application inside the Google Workspace Admin console so students don&apos;t receive &quot;unverified application&quot; alerts:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Go to <strong>Security &gt; Access and data control &gt; API controls</strong>.</li>
                  <li>Click <strong>Manage Third-Party App Access</strong>.</li>
                  <li>Add the OAuth Client ID as a <strong>Trusted Internal App</strong>.</li>
                  <li>Scope access to organizational units (e.g., &quot;Students - Grade 8 to 12&quot; and &quot;Faculty&quot;).</li>
                </ol>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Student Roster Auto-Mapping</span>
                </div>
                <p className="text-slate-600">
                  When a student signs in with <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">aarav.patel@indigenous-school.edu</code>, the system automatically correlates the email prefix or Google directory email with their official Student ID (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">IS-2026-G10-042</code>), grade level, and academic records.
                </p>
              </div>

            </div>
          )}

          {activeTab === 'simulate' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                <span className="font-bold">Test &amp; Verify School Account Integration:</span>
                <p className="mt-1">
                  You can simulate how a student or teacher connects their official school-managed Google Workspace account right now.
                </p>
              </div>

              {domainWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{domainWarning}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSimulatedConnect} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    School Google Account Email (@school.edu)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="student.name@indigenous-school.edu"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must be a school domain (e.g. @indigenous-school.edu, @school.edu). Personal @gmail.com accounts are rejected.
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Or select a preset school account to test:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { name: 'Aarav Patel (Gr 10)', email: 'aarav.patel@indigenous-school.edu' },
                      { name: 'Priya Sharma (Gr 12)', email: 'priya.sharma@indigenous-school.edu' },
                      { name: 'Maya Lin (Gr 8)', email: 'maya.lin@indigenous-school.edu' },
                      { name: 'Dr. Mukherjee (Faculty)', email: 'h.mukherjee@indigenous-school.edu' },
                    ].map((acct) => (
                      <button
                        type="button"
                        key={acct.email}
                        onClick={() => setTestEmail(acct.email)}
                        className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer text-slate-700"
                      >
                        <div className="font-semibold text-[11px] text-slate-800">{acct.name}</div>
                        <div className="text-[10px] font-mono text-emerald-800 truncate">{acct.email}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate &amp; Link School Google Account</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                To connect the app to your live Google Cloud project, add your School Google OAuth Client ID to your environment configuration:
              </p>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs space-y-2 relative">
                <button
                  onClick={() => copyToClipboard(`VITE_GOOGLE_CLIENT_ID=your-school-app-id.apps.googleusercontent.com\nVITE_SCHOOL_GOOGLE_DOMAIN=indigenous-school.edu`, 'env-vars')}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1"
                  title="Copy env"
                >
                  {copiedSection === 'env-vars' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-400"># .env or .env.local</div>
                <div>VITE_GOOGLE_CLIENT_ID=your-school-app-id.apps.googleusercontent.com</div>
                <div>VITE_SCHOOL_GOOGLE_DOMAIN=indigenous-school.edu</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Security Best Practice
                </div>
                <p>
                  Never expose client secrets in client-side code. Google Sign-In via Google Identity Services uses public OAuth 2.0 Client IDs, and tokens are validated server-side by checking the Google-issued JWT signature.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-emerald-700" />
            Indigenous School Academic Identity System
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
