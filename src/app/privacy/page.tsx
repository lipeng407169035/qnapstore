'use client';

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">隐私政策</h1>
          <p className="text-white/60 text-sm">最后更新：2026年3月</p>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-lg mb-3">信息收集</h2>
            <p>我们收集您在使用 QNAP 网上商城时主动提供的个人信息，包括姓名、电子邮件地址、电话号码、收货地址等，以便处理订单和提供客户服务。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">信息使用</h2>
            <p>您的个人信息将用于处理订单、提供客户服务、发送订单确认邮件、以及个性化的产品推荐。我们不会将您的个人信息出售给任何第三方。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">信息安全</h2>
            <p>我们采用 256-bit SSL 加密技术保护您的数据传输安全，并采取合理的物理、电子和管理措施保护您的个人信息。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">Cookies</h2>
            <p>我们使用 Cookies 来记住您的偏好设置、改善用户体验。请参阅 Cookie 设置页面以管理您的 Cookie 偏好。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">联系我们</h2>
            <p>如对隐私政策有任何疑问，请联系 <a href="mailto:privacy@qnap.com" className="text-blue hover:underline">privacy@qnap.com</a></p>
          </section>
        </div>
      </div>
    </>
  );
}
