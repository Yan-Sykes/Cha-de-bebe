import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RSVPData {
  guest_name: string;
  email: string;
  phone: string | null;
  will_attend: boolean;
  number_of_guests: number;
  dietary_restrictions: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const rsvpData: RSVPData = await req.json();

    const parentEmail = Deno.env.get("PARENT_EMAIL") || "parents@example.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured. Email will not be sent.");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "RSVP received but email service not configured" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const attendanceStatus = rsvpData.will_attend ? "✓ Confirmado" : "✗ Não poderá comparecer";
    const guestCount = rsvpData.will_attend ? rsvpData.number_of_guests : 0;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f8b4d9 0%, #a8d8f0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .info-row { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .label { font-weight: bold; color: #ec4899; }
            .status-confirmed { color: #10b981; font-weight: bold; font-size: 18px; }
            .status-declined { color: #ef4444; font-weight: bold; font-size: 18px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍼 Nova Confirmação de Presença</h1>
            </div>
            <div class="content">
              <p>Você recebeu uma nova resposta para o Chá de Bebê:</p>
              
              <div class="info-row">
                <span class="label">Status:</span>
                <div class="${rsvpData.will_attend ? 'status-confirmed' : 'status-declined'}">
                  ${attendanceStatus}
                </div>
              </div>

              <div class="info-row">
                <span class="label">Nome do Convidado:</span>
                <div>${rsvpData.guest_name}</div>
              </div>

              <div class="info-row">
                <span class="label">E-mail:</span>
                <div>${rsvpData.email}</div>
              </div>

              ${rsvpData.phone ? `
              <div class="info-row">
                <span class="label">Telefone:</span>
                <div>${rsvpData.phone}</div>
              </div>
              ` : ''}

              ${rsvpData.will_attend ? `
              <div class="info-row">
                <span class="label">Número de Pessoas:</span>
                <div>${guestCount} ${guestCount === 1 ? 'pessoa' : 'pessoas'}</div>
              </div>
              ` : ''}

              ${rsvpData.dietary_restrictions ? `
              <div class="info-row">
                <span class="label">Restrições Alimentares:</span>
                <div>${rsvpData.dietary_restrictions}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Este é um e-mail automático do sistema de RSVP do Chá de Bebê</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Chá de Bebê <onboarding@resend.dev>",
        to: [parentEmail],
        subject: `Nova Confirmação: ${rsvpData.guest_name} - ${rsvpData.will_attend ? 'Confirmado' : 'Não comparecerá'}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Internal server error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});