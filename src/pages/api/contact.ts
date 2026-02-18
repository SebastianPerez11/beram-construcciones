import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Generar número de consulta único
function generarNumeroConsulta(): string {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minuto = String(fecha.getMinutes()).padStart(2, '0');
  const segundo = String(fecha.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `BC-${año}${mes}${dia}-${hora}${minuto}${segundo}-${random}`;
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🔵 API Contact llamada');
  
  try {
    const data = await request.json();
    console.log('📝 Datos recibidos:', data);
    
    const { nombre, email, telefono, servicio, mensaje } = data;

    if (!nombre || !email || !telefono || !servicio || !mensaje) {
      console.log('❌ Validación fallida');
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const numeroConsulta = generarNumeroConsulta();
    console.log('📋 Número de consulta:', numeroConsulta);

    const { data: emailData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'beram.construcciones@gmail.com',
      subject: `[${numeroConsulta}] Nueva consulta de ${nombre} - ${servicio}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2C3E50 0%, #3498db 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                Nueva Consulta
              </h1>
              <p style="color: #ecf0f1; margin: 10px 0 0 0; font-size: 14px;">
                Beram Construcciones
              </p>
            </div>

            <!-- Número de Consulta -->
            <div style="background: #3498db; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Número de Consulta
              </p>
              <p style="color: white; margin: 5px 0 0 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                ${numeroConsulta}
              </p>
            </div>

            <!-- Contenido -->
            <div style="padding: 30px;">
              
              <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #ecf0f1;">
                <p style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: 1px;">
                  Nombre
                </p>
                <p style="color: #2C3E50; font-size: 18px; font-weight: bold; margin: 0;">
                  ${nombre}
                </p>
              </div>

              <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #ecf0f1;">
                <p style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: 1px;">
                  Email
                </p>
                <p style="color: #2C3E50; font-size: 16px; margin: 0;">
                  <a href="mailto:${email}" style="color: #3498db; text-decoration: none;">
                    ${email}
                  </a>
                </p>
              </div>

              <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #ecf0f1;">
                <p style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: 1px;">
                  Teléfono
                </p>
                <p style="color: #2C3E50; font-size: 16px; margin: 0;">
                  <a href="tel:${telefono}" style="color: #3498db; text-decoration: none;">
                    ${telefono}
                  </a>
                </p>
              </div>

              <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #ecf0f1;">
                <p style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: 1px;">
                  Servicio Solicitado
                </p>
                <p style="color: #2C3E50; font-size: 16px; font-weight: bold; margin: 0;">
                  ${servicio}
                </p>
              </div>

              <div style="margin-bottom: 0;">
                <p style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 1px;">
                  Mensaje
                </p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db;">
                  <p style="color: #2C3E50; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                    ${mensaje}
                  </p>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background: #ecf0f1; padding: 20px; text-align: center;">
              <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                📅 Recibido el ${new Date().toLocaleDateString('es-AR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p style="color: #95a5a6; font-size: 11px; margin: 10px 0 0 0;">
                Este email fue enviado desde el formulario de contacto de beram-construcciones.vercel.app
              </p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      return new Response(
        JSON.stringify({ error: 'Error al enviar el email', details: error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Email enviado correctamente:', emailData);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado correctamente',
        numeroConsulta: numeroConsulta
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error en API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};