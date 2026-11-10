'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [ramo, setRamo] = useState('incendio'); // Estado para el tipo de póliza
  const [isAuditing, setIsAuditing] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAudit = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo PDF primero.");
      return;
    }
    setIsAuditing(true);
    setResultado(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ramo', ramo); // Enviamos el ramo elegido al backend

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.exito) {
        setResultado(data.auditoria);
      } else {
        alert("Hubo un error en la auditoría: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-blue-500 mb-4 tracking-tight">
          SmartWorld <span className="text-white">Auditor</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Plataforma de auditoría inteligente de pólizas de seguros. 
          Sube tu documento y obtén un Resumen Ejecutivo y una Guía de Siniestro en segundos.
        </p>
      </div>

      {/* Tarjeta Central de Carga */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-xl text-center mb-8">
        
        {/* SELECTOR DE RAMO */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Selecciona el ramo de la póliza:
          </label>
          <select 
            value={ramo} 
            onChange={(e) => setRamo(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="incendio">Incendio y Líneas Aliadas</option>
            <option value="vehiculos">Vehículos (Autos)</option>
            <option value="vida">Vida y Desgravamen</option>
            <option value="salud">Salud / EPS</option>
            <option value="rc">Responsabilidad Civil</option>
            <option value="sctr">SCTR</option>
            <option value="otros">Otro Ramo / Análisis General</option>
          </select>
        </div>

        <div className="mb-8">
          <svg className="w-12 h-12 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all"
          />
        </div>

        <button 
          onClick={handleAudit}
          disabled={isAuditing}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isAuditing ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'
          }`}
        >
          {isAuditing ? 'Auditando documento (esto puede tardar)...' : 'Iniciar Auditoría IA'}
        </button>
      </div>

      {/* Área de Resultados */}
      {resultado && (
        <div className="w-full max-w-4xl bg-slate-800 p-8 rounded-2xl border border-green-500/50 shadow-2xl">
          <h2 className="text-2xl font-bold text-green-400 mb-4 border-b border-slate-700 pb-2">Resultado de la Auditoría</h2>
          <div className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
            {resultado}
          </div>
        </div>
      )}

      {/* Pie de página */}
      <p className="mt-12 text-slate-500 text-sm">
        © 2026 SmartWorld AI. Impulsado por DeepSeek & IP Blindada.
      </p>
    </main>
  );
}