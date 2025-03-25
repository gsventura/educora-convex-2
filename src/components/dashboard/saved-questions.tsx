import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Tag,
  Download,
  MoreVertical,
  FileText,
  Trash,
  Edit,
  Eye,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Document, Paragraph, TextRun, Packer, HeadingLevel, PageBreak, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedItem {
  _id: string;
  type: string;
  content: string;
  subject?: string;
  tags: string[];
  createdAt: string;
}

export function SavedQuestions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");  // Mantenho para compatibilidade
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [viewType, setViewType] = useState<"all" | "questions" | "answers">(
    "all",
  );
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewingItem, setViewingItem] = useState<SavedItem | null>(null);

  // Estados para o diálogo de confirmação
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);

  // Get subjects from Convex
  const subjects = useQuery(api.subjects.getAllSubjects);

  // Fetch saved items from Convex
  const savedItemsQuery = useQuery(api.savedItems.getUserSavedItems, {
    type:
      viewType === "all"
        ? undefined
        : viewType === "questions"
          ? "question"
          : "answer",
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    searchTerm: searchTerm || undefined,
  });

  // Apply additional filters client-side (subject and date)
  const filteredItems = savedItemsQuery
    ? savedItemsQuery.filter((item) => {
        // Subject filter
        if (
          selectedSubject &&
          selectedSubject !== "all-subjects" &&
          item.subject !== selectedSubject
        ) {
          return false;
        }

        // Date range filter
        if (dateRange && dateRange.from) {
          const itemDate = parseISO(item.createdAt);
          
          if (dateRange.to) {
            // Se temos data inicial e final, filtrar por intervalo
            return isWithinInterval(itemDate, {
              start: dateRange.from,
              end: dateRange.to
            });
          } else {
            // Se temos apenas data inicial, filtrar por dia específico
            return itemDate >= dateRange.from && 
                  itemDate <= new Date(dateRange.from.getFullYear(), 
                                     dateRange.from.getMonth(), 
                                     dateRange.from.getDate(), 23, 59, 59);
          }
        }
        
        // Manter o filtro original como fallback
        if (dateFilter && dateFilter !== "all-time") {
          const itemDate = new Date(item.createdAt);
          const now = new Date();

          if (dateFilter === "today") {
            return itemDate.toDateString() === now.toDateString();
          } else if (dateFilter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return itemDate >= weekAgo;
          } else if (dateFilter === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return itemDate >= monthAgo;
          }
        }

        return true;
      })
    : [];

  const deleteItemMutation = useMutation(api.savedItems.deleteSavedItem);
  const updateTagsMutation = useMutation(api.savedItems.updateItemTags);
  const exportItemsQuery = useQuery(api.savedItems.exportSavedItems, {
    type:
      viewType === "all"
        ? undefined
        : viewType === "questions"
          ? "question"
          : "answer",
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    format: "markdown", // Default format
  });

  // Get all unique tags from saved items
  const allTags: string[] = savedItemsQuery
    ? Array.from(new Set(savedItemsQuery.flatMap((item) => item.tags)))
    : [];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleDeleteItem = async (id: string) => {
    setItemToDelete(id);
    setIsDeletingMultiple(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (!selectedItems.length) return;
    setIsDeletingMultiple(true);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (isDeletingMultiple) {
        // Delete each selected item
        for (const id of selectedItems) {
          await deleteItemMutation({ itemId: id as any });
        }
        setSelectedItems([]);
        toast({
          title: "Itens excluídos",
          description: `${selectedItems.length} item(s) foram excluídos com sucesso.`,
          variant: "default",
        });
      } else if (itemToDelete) {
        await deleteItemMutation({ itemId: itemToDelete as any });
        // Clear from selected items if it was selected
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== itemToDelete));
        toast({
          title: "Item excluído",
          description: "O item foi excluído com sucesso.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to delete items:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir os itens selecionados.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      setIsDeletingMultiple(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (filteredItems.length === selectedItems.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(filteredItems.map((item) => item._id));
    }
  };

  const viewFullItem = (item: SavedItem) => {
    setViewingItem(item);
  };

  const handleExport = (format: "markdown" | "docx") => {
    if (selectedItems.length === 0) return;
    
    const selectedContent = savedItemsQuery?.filter(item => 
      selectedItems.includes(item._id)
    ) || [];
    
    let exportContent = "";
    
    if (format === "markdown") {
      selectedContent.forEach(item => {
        exportContent += `# ${item.type === "question" ? "Questão" : "Resposta"}\n\n`;
        if (item.subject) {
          exportContent += `**Disciplina:** ${item.subject}\n\n`;
        }
        if (item.tags && item.tags.length > 0) {
          exportContent += `**Tags:** ${item.tags.join(", ")}\n\n`;
        }
        exportContent += `${item.content}\n\n---\n\n`;
      });
      
      // Criar um elemento a para download
      const element = document.createElement("a");
      const file = new Blob([exportContent], { type: "text/markdown" });
      element.href = URL.createObjectURL(file);
      element.download = `educora-export-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (format === "docx") {
      // Função para converter HTML para texto simples
      const htmlToPlainText = (html: string): string => {
        // Criar um elemento temporário para manipular o HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Substituir <br> por quebras de linha
        const brs = tempDiv.querySelectorAll('br');
        brs.forEach(br => {
          br.replaceWith('\n');
        });
        
        // Adicionar quebras de linha após parágrafos e listas
        const blocks = tempDiv.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6');
        blocks.forEach(block => {
          if (block.textContent?.trim()) {
            block.innerHTML = block.innerHTML + '\n';
          }
        });
        
        // Marcar itens de lista
        const listItems = tempDiv.querySelectorAll('li');
        listItems.forEach(li => {
          li.innerHTML = '• ' + li.innerHTML;
        });
        
        // Limpar e retornar apenas o texto
        return tempDiv.textContent || '';
      };
      
      try {
        // Criar array de conteúdo para o documento
        const documentChildren: Paragraph[] = [];
        
        // Processar cada item selecionado
        selectedContent.forEach((item, index) => {
          // Título: Questão ou Resposta
          documentChildren.push(
            new Paragraph({
              text: item.type === "question" ? "Questão" : "Resposta",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                after: 200
              }
            })
          );
          
          // Disciplina, se houver
          if (item.subject) {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Disciplina: ",
                    bold: true
                  }),
                  new TextRun({
                    text: item.subject
                  })
                ],
                spacing: {
                  after: 200
                }
              })
            );
          }
          
          // Tags, se houver
          if (item.tags && item.tags.length > 0) {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Tags: ",
                    italics: true
                  }),
                  new TextRun({
                    text: item.tags.join(", "),
                    italics: true
                  })
                ],
                spacing: {
                  after: 200
                }
              })
            );
          }
          
          // Espaço antes do conteúdo
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: "" })
              ],
              spacing: {
                after: 100
              }
            })
          );
          
          // Conteúdo principal como texto simples
          const plainContent = htmlToPlainText(item.content);
          
          // Dividir o conteúdo em parágrafos
          const paragraphs = plainContent.split("\n").filter(p => p.trim());
          
          paragraphs.forEach(paragraph => {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({ text: paragraph })
                ],
                spacing: {
                  after: 120
                }
              })
            );
          });
          
          // Adicionar quebra de página entre itens, exceto no último
          if (index < selectedContent.length - 1) {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "",
                    break: 1
                  })
                ]
              })
            );
          }
        });
        
        // Criar o documento com o conteúdo
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: documentChildren
            }
          ]
        });
        
        // Gerar o arquivo DOCX e fazer download
        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, `educora-export-${new Date().toISOString().slice(0, 10)}.docx`);
          
          toast({
            title: "Exportação concluída",
            description: `${selectedContent.length} item(s) exportados em formato DOCX.`,
            variant: "default",
          });
        });
      } catch (error) {
        console.error("Erro ao gerar arquivo DOCX:", error);
        toast({
          title: "Erro na exportação",
          description: "Não foi possível gerar o arquivo DOCX.",
          variant: "destructive",
        });
      }
    }
  };

  const openEditTagsDialog = (item: SavedItem) => {
    setEditingItem(item);
    setEditTags([...item.tags]);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  const handleSaveTags = async () => {
    if (!editingItem) return;

    try {
      await updateTagsMutation({
        itemId: editingItem._id as any,
        tags: editTags,
      });
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating tags:", error);
      alert("Failed to update tags. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Questões e Respostas Salvas</CardTitle>
          <CardDescription>
            Navegue, busque e exporte seu conteúdo salvo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Busque por palavra-chave, disciplina ou tag"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {/* Subject Filter */}
              <Select
                value={selectedSubject || "all-subjects"}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subjects">Todas as Disciplinas</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Filter - Substitui o filtro de data anterior */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[230px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Filtrar por período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 flex flex-col gap-2 border-b">
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDateRange(undefined)}
                      >
                        Limpar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-2 py-0 h-7"
                        onClick={() => {
                          const today = new Date();
                          setDateRange({
                            from: today,
                            to: today
                          });
                        }}
                      >
                        Hoje
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-2 py-0 h-7"
                        onClick={() => {
                          const today = new Date();
                          const weekAgo = new Date();
                          weekAgo.setDate(today.getDate() - 7);
                          setDateRange({
                            from: weekAgo,
                            to: today
                          });
                        }}
                      >
                        Últimos 7 dias
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-2 py-0 h-7"
                        onClick={() => {
                          const today = new Date();
                          const monthAgo = new Date();
                          monthAgo.setMonth(today.getMonth() - 1);
                          setDateRange({
                            from: monthAgo,
                            to: today
                          });
                        }}
                      >
                        Últimos 30 dias
                      </Button>
                    </div>
                  </div>
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={new Date()}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <Tabs
            value={viewType}
            onValueChange={(value) =>
              setViewType(value as "all" | "questions" | "answers")
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tudo</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="answers">Respostas</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selection controls */}
      {filteredItems.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <CheckSquare className="h-4 w-4" />
              {selectedItems.length === filteredItems.length
                ? "Desmarcar Todos"
                : "Marcar Todos"}
            </Button>
            <span className="text-sm text-gray-500">
              {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("markdown")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Formato Markdown (.md)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("docx")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Formato Word (.docx)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Excluir Selecionados
              </Button>
            </div>
          )}
        </div>
      )}

      {savedItemsQuery === undefined ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Nenhum item encontrado
          </h3>
          <p className="text-gray-600">
            {searchTerm ||
            selectedTags.length > 0 ||
            selectedSubject ||
            dateRange
              ? "Tente ajustar sua busca ou filtros"
              : "Salve questões e respostas para vê-las aqui"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className={
                selectedItems.includes(item._id)
                  ? "border-2 border-indigo-500"
                  : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleItemSelection(item._id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <Badge
                        variant={
                          item.type === "question" ? "default" : "secondary"
                        }
                      >
                        {item.type === "question" ? "Questão" : "Resposta"}
                      </Badge>
                      {item.subject && (
                        <Badge variant="outline" className="ml-2">
                          {item.subject}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => viewFullItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditTagsDialog(item)}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                            Editar Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Only show the prompt for questions, not the full content */}
                <p className="text-gray-800">
                  {item.type === "question"
                    ? // Extract just the prompt from the content
                      item.content.split("\n")[0].substring(0, 150) +
                      (item.content.length > 150 ? "..." : "")
                    : item.content.substring(0, 150) +
                      (item.content.length > 150 ? "..." : "")}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs text-gray-500 pt-0">
                <span>
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewFullItem(item)}
                >
                  Ver Conteúdo Completo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Tags Dialog */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tags</DialogTitle>
            <DialogDescription>
              Adicione ou remova tags para organizar melhor seu conteúdo salvo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {editTags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 px-3 py-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                    <Trash className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Adicione uma nova tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag} type="button" variant="outline">
                Adicionar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTags}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Full Content Dialog */}
      <Dialog
        open={!!viewingItem}
        onOpenChange={(open) => !open && setViewingItem(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {viewingItem?.type === "question" ? "Questão" : "Resposta"}
              {viewingItem?.subject && ` - ${viewingItem.subject}`}
            </DialogTitle>
            <DialogDescription>
              Criado em{" "}
              {viewingItem &&
                new Date(viewingItem.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line">
              {viewingItem?.content}
            </div>

            <div className="flex flex-wrap gap-1 mt-4">
              {viewingItem?.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingItem(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {isDeletingMultiple 
                ? `Tem certeza que deseja excluir ${selectedItems.length} item(s) selecionado(s)?` 
                : "Tem certeza que deseja excluir este item?"}
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
