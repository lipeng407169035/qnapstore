'use client';

import { useEffect, useState } from 'react';
import { FileText, HardDrive, Package, Download } from 'lucide-react';

interface Download {
  id: string;
  sku: string;
  fileName: string;
  fileType: string;
  version: string;
  size: string;
  url: string;
  createdAt: string;
}

const PRODUCT_OPTIONS = ['全部产品', 'TS-464', 'TS-264', 'TS-233', 'TS-673A', 'TVS-h874', 'QSW-1105-5T', 'QSW-M408S'];

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [skuFilter, setSkuFilter] = useState('全部产品');

  useEffect(() => { fetchDownloads(); }, [skuFilter]);

  async function fetchDownloads() {
    setLoading(true);
    try {
      const url = skuFilter === '全部产品' ? '/api/downloads' : `/api/downloads?sku=${skuFilter}`;
      const res = await fetch(url);
      setDownloads(await res.json());
    } catch { setDownloads([]); }
    setLoading(false);
  }

  const grouped = downloads.reduce((acc, d) => {
    if (!acc[d.sku]) acc[d.sku] = [];
    acc[d.sku].push(d);
    return acc;
  }, {} as Record<string, Download[]>);

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">下载中心</h1>
          <p className="text-white/60 text-sm">驱动、手册、固件一键下载</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {PRODUCT_OPTIONS.map(s => (
            <button key={s} onClick={() => setSkuFilter(s)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${skuFilter === s ? 'bg-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue hover:text-blue'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue border-t-transparent mx-auto" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="mb-4"><Package className="w-12 h-12 text-gray-300 mx-auto" /></div>
            <p className="text-lg">暂无下载文件</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([sku, files]) => (
              <div key={sku}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm">{sku}</span>
                  <span className="text-gray-400 text-sm font-normal">共 {files.length} 个文件</span>
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-500 text-xs">
                        <th className="px-5 py-3 font-medium">文件名</th>
                        <th className="px-5 py-3 font-medium">类型</th>
                        <th className="px-5 py-3 font-medium">版本</th>
                        <th className="px-5 py-3 font-medium">大小</th>
                        <th className="px-5 py-3 font-medium text-right">下载</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map(f => (
                        <tr key={f.id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {f.fileType === 'PDF' ? <FileText className="w-5 h-5 text-blue" /> : f.fileType === 'BIN' ? <HardDrive className="w-5 h-5 text-blue" /> : <Package className="w-5 h-5 text-blue" />}
                              </span>
                              <span className="font-medium">{f.fileName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${f.fileType === 'PDF' ? 'bg-red-50 text-red-600' : f.fileType === 'BIN' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                              {f.fileType}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">{f.version || '-'}</td>
                          <td className="px-5 py-3.5 text-gray-400">{f.size}</td>
                          <td className="px-5 py-3.5 text-right">
                            <a href={f.url} download className="text-blue text-sm font-medium hover:underline">下载</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
