import { Navbar } from "../components/navbar";

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Termos de Uso</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar ou utilizar a plataforma Educora, você concorda em cumprir e ficar vinculado a estes Termos de Uso.
                Se você não concordar com qualquer parte destes termos, por favor, não utilize nossos serviços.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Descrição do Serviço</h2>
              <p>
                A Educora é uma plataforma educacional que oferece serviços online relacionados ao aprendizado e desenvolvimento
                acadêmico. Nossos serviços incluem, mas não se limitam a, conteúdos educacionais, ferramentas de estudo, e
                recursos para professores e alunos.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Contas de Usuário</h2>
              <p>
                Para acessar determinados recursos da plataforma, você precisa criar uma conta. Você é responsável por:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Manter a confidencialidade de suas credenciais de login</li>
                <li>Todas as atividades que ocorrem sob sua conta</li>
                <li>Fornecer informações precisas e completas</li>
                <li>Atualizar suas informações quando necessário</li>
              </ul>
              <p className="mt-2">
                Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos ou que permaneçam inativas por
                um período prolongado.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo disponibilizado na Educora, incluindo textos, gráficos, logotipos, imagens, vídeos, e
                software, é propriedade da Educora ou de seus licenciadores e está protegido por leis de propriedade intelectual.
              </p>
              <p className="mt-2">
                Você pode usar o conteúdo apenas para fins pessoais e não comerciais. Não é permitido copiar, modificar,
                distribuir, vender ou alugar qualquer parte da plataforma sem nossa autorização expressa.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Conduta do Usuário</h2>
              <p>
                Ao usar a Educora, você concorda em não:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Violar leis ou regulamentos aplicáveis</li>
                <li>Compartilhar conteúdo ofensivo, difamatório, obsceno ou ilegal</li>
                <li>Tentar acessar áreas restritas da plataforma</li>
                <li>Interferir no funcionamento da plataforma ou servidores</li>
                <li>Coletar informações de outros usuários sem consentimento</li>
                <li>Utilizar a plataforma para enviar spam ou conteúdo malicioso</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Assinaturas e Pagamentos</h2>
              <p>
                Alguns serviços da Educora podem requerer o pagamento de uma assinatura. Ao assinar:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Você concorda com os termos de pagamento específicos</li>
                <li>As assinaturas são renovadas automaticamente até cancelamento</li>
                <li>Os preços estão sujeitos a alterações com aviso prévio</li>
                <li>Reembolsos seguem nossa política específica</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Limitação de Responsabilidade</h2>
              <p>
                A Educora fornece sua plataforma "como está" e não oferece garantias de qualquer tipo, expressas ou implícitas.
                Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso
                ou da incapacidade de usar nossos serviços.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Modificações dos Termos</h2>
              <p>
                Podemos modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor após a publicação
                dos termos atualizados. O uso continuado da plataforma após tais alterações constitui sua aceitação dos
                novos termos.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">9. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa decorrente ou relacionada com o uso
                da plataforma será submetida à jurisdição exclusiva dos tribunais brasileiros.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">10. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail:
                <span className="text-indigo-600 ml-1">contato@educora.com.br</span>
              </p>
            </section>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 