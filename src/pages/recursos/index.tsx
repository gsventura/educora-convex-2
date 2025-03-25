import { Outlet } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function RecursosHub() {
  // Podemos buscar uma lista de recursos disponíveis através de uma query Convex
  const recursos = useQuery(api.recursos.listarRecursos) || [];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <p className="text-gray-500 dark:text-gray-400">
          Encontre aqui dicas, guias e tutoriais para aproveitar ao máximo nossa plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recursos.map((recurso) => (
          <Card key={recurso._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{recurso.titulo}</CardTitle>
              <CardDescription>{recurso.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/recursos/${recurso.slug}`}>Acessar</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {/* Exemplo fixo enquanto não temos dados reais */}
        {recursos.length === 0 && (
          <>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Primeiros Passos</CardTitle>
                <CardDescription>Guia completo para começar a usar nossa plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/recursos/primeiros-passos">Acessar</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Dicas Avançadas</CardTitle>
                <CardDescription>Recursos avançados para usuários experientes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/recursos/dicas-avancadas">Acessar</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/recursos/faq">Acessar</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Área para exibir o conteúdo das subrotas */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
} 