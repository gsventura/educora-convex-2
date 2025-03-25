import { Navbar } from "../components/navbar";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Política de Privacidade</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introdução</h2>
              <p>
                Bem-vindo à Política de Privacidade da Educora. Respeitamos sua privacidade e estamos comprometidos
                em proteger seus dados pessoais. Esta política explica como coletamos, usamos e protegemos as informações
                que você nos fornece ao utilizar nossa plataforma.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Informações que Coletamos</h2>
              <p>
                Podemos coletar os seguintes tipos de informações:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Informações de identificação pessoal (nome, e-mail, telefone)</li>
                <li>Informações de uso da plataforma</li>
                <li>Informações do dispositivo e conexão</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Como Usamos suas Informações</h2>
              <p>
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Comunicar-nos com você sobre atualizações e recursos</li>
                <li>Garantir a segurança da plataforma</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Compartilhamento de Informações</h2>
              <p>
                Não compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Com provedores de serviços que nos ajudam a operar a plataforma</li>
                <li>Quando exigido por lei ou processo legal</li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança apropriadas para proteger suas informações contra acesso não autorizado,
                alteração, divulgação ou destruição. No entanto, nenhuma transmissão pela internet ou armazenamento
                eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Seus Direitos</h2>
              <p>
                Você tem direitos em relação aos seus dados pessoais, incluindo:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acesso às suas informações pessoais</li>
                <li>Correção de dados incompletos ou imprecisos</li>
                <li>Exclusão de dados em determinadas circunstâncias</li>
                <li>Restrição ou objeção ao processamento</li>
                <li>Portabilidade de dados</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente
                para se manter informado sobre nossas práticas de privacidade. A data da última atualização será
                sempre indicada no topo desta política.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos seus dados,
                entre em contato conosco pelo e-mail: <span className="text-indigo-600">privacidade@educora.com.br</span>
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