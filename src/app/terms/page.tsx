'use client';

export default function TermsPage() {
  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">服务条款</h1>
          <p className="text-white/60 text-sm">最后更新：2026年3月</p>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-lg mb-3">总则</h2>
            <p>使用 QNAP 网上商城即表示您同意以下服务条款。QNAP 保留随时修改条款的权利，修改后的条款将在本页面公布。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">账户注册</h2>
            <p>您需要提供真实准确的注册信息，并妥善保管账户密码。您对账户下发生的所有活动负全部责任。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">订单与支付</h2>
            <p>商品价格以页面显示为准，我们接受支付宝、微信支付、银联及货到付款。订单确认后将在 1-2 个工作日发货。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">退货与退款</h2>
            <p>自收到商品之日起 7 天内可申请退货（定制商品除外）。退货商品需保持原包装完整，请参阅退换货政策页面了解详情。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">知识产权</h2>
            <p>QNAP、QTS、QuTS hero 等商标为 QNAP Systems, Inc. 的注册商标。未经授权不得复制或使用。</p>
          </section>
          <section>
            <h2 className="font-bold text-lg mb-3">联系我们</h2>
            <p>如有任何疑问，请联系 <a href="mailto:store@qnap.com" className="text-blue hover:underline">store@qnap.com</a></p>
          </section>
        </div>
      </div>
    </>
  );
}
