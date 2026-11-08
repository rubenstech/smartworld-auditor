import { NextResponse } from 'next/server';
import { extractText, getDocumentProxy } from 'unpdf';

export async function POST(req) {
  try {
    // 1. Recibir el archivo y el ramo elegido
    const data = await req.formData();
    const file = data.get('file');
    const ramo = data.get('ramo');

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // 2. Convertir el PDF a texto usando UNPDF
    const bytes = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(bytes));
    const { text: textoPoliza } = await extractText(pdf, { mergePages: true });

    // 3. Tu "IP Blindada" (Living Bluebooks)
    const blueprints = {
      incendio: `Actúa como un Auditor de Seguros Senior en Perú. Lee este condicionado de Incendio y Líneas Aliadas. Extrae: 1) ¿Qué cubre realmente la póliza? 2) Las 3 exclusiones más peligrosas (Terremoto, Lucro Cesante, Daños Eléctricos). 3) ¿Cómo funcionan los deducibles? 4) ¿Qué es el Infraseguro? 5) Guía de Siniestro: ¿A qué teléfono llamar, en qué plazo denunciar (3 días), y qué documentos exigir para la declaración formal (30 días)?`,
      
      vehiculos: `Actúa como un Auditor de Seguros de Vehículos en Perú. Lee este condicionado y extrae: 1) Deducibles exactos (choque, robo, daños a terceros). 2) La regla de Pérdida Total (¿es al 75% o al 80% del valor comercial?). 3) Coberturas adicionales. 4) Restricciones de uso (¿Cubre uso en apps como Uber?). 5) Guía de Siniestro: ¿Qué denuncia policial se necesita y en qué plazo?`,
      
      vida: `Actúa como un Auditor de Seguros de Vida en Perú. Lee esta póliza y extrae: 1) ¿Quiénes son los beneficiarios y qué porcentaje les corresponde? 2) Períodos de Carencia (muerte natural, suicidio, preexistencias). 3) ¿Tiene valor de rescate? 4) Exclusiones médicas. 5) Guía de Siniestro: ¿Qué documentos debe presentar la familia en caso de fallecimiento y cuál es el plazo máximo?`,
      
      salud: `Actúa como un Auditor de Seguros de Salud en Perú. Lee el documento y extrae: 1) Las Preexistencias excluidas. 2) Los Copagos (consulta, hospitalización, farmacia). 3) Red de Clínicas preferentes. 4) Topes anuales. 5) Guía de Siniestro: ¿Cómo se solicita una Carta de Garantía antes de una hospitalización y cuál es el proceso de reembolso?`,
      
      rc: `Actúa como un Auditor de Seguros de Responsabilidad Civil en Perú. Lee esta póliza y extrae: 1) El Límite Asegurado (¿es Único y Combinado?). 2) Exclusiones clave. 3) La base del deducible (¿monto fijo o porcentaje?). 4) Guía de Siniestro: ¿Quién designa a los abogados? ¿Qué plazo hay para notificar una demanda?`,
      
      sctr: `Actúa como un Auditor de SCTR en Perú. Lee esta póliza y extrae: 1) La actividad de riesgo declarada. 2) Coberturas de Salud y Pensiones. 3) Porcentajes de IPP. 4) Guía de Siniestro: ¿Cómo se activa el SCTR ante un accidente laboral y qué rol juega SUNAFIL en las primeras 24 horas?`
    };

    // Seleccionamos el prompt según el ramo, o usamos incendio por defecto
    const promptAuditor = blueprints[ramo] || blueprints.incendio;

    const instruccionFinal = promptAuditor + " Cita siempre el número de artículo o cláusula. Si algo no está en el texto, escribe 'No especificado en la póliza'.";

    // 4. Conectar con el motor de DeepSeek
    const respuestaDeepSeek = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` 
      },
      body: JSON.stringify({
        model: 'deepseek-flash',
        messages: [
          { role: 'system', content: instruccionFinal },
          { role: 'user', content: textoPoliza }
        ],
        temperature: 0.1 
      })
    });

    if (!respuestaDeepSeek.ok) {
      throw new Error('Error en la API de DeepSeek');
    }

    const datos = await respuestaDeepSeek.json();
    const resultadoIA = datos.choices[0].message.content;

    return NextResponse.json({ 
      exito: true, 
      auditoria: resultadoIA 
    });

  } catch (error) {
    console.error('Error en el backend:', error);
    return NextResponse.json({ error: 'Error procesando la auditoría.' }, { status: 500 });
  }
}