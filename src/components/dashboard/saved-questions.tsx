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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [dateFilter, setDateFilter] = useState<string>(""); // "today", "week", "month", "all"
  const [viewType, setViewType] = useState<"all" | "questions" | "answers">(
    "all",
  );
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewingItem, setViewingItem] = useState<SavedItem | null>(null);

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

        // Date filter
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
  const allTags = savedItemsQuery
    ? Array.from(new Set(savedItemsQuery.flatMap((item) => item.tags)))
    : [];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItemMutation({ itemId: id as any });
      // Clear from selected items if it was selected
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedItems.length) return;

    if (confirm(`Delete ${selectedItems.length} selected items?`)) {
      try {
        // Delete each selected item
        for (const id of selectedItems) {
          await deleteItemMutation({ itemId: id as any });
        }
        setSelectedItems([]);
      } catch (error) {
        console.error("Error deleting selected items:", error);
        alert("Failed to delete some items. Please try again.");
      }
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
    // This would trigger an actual export in a real implementation
    alert(`Exporting ${savedItemsQuery?.length || 0} items as ${format}`);
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
          <CardTitle>Saved Questions & Answers</CardTitle>
          <CardDescription>
            Browse, search, and export your saved content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by keyword, subject, or tag"
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
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subjects">All Subjects</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select
                value={dateFilter || "all-time"}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport("markdown")}>
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("docx")}>
                    Export as DOCX
                  </DropdownMenuItem>
                  {selectedItems.length > 0 && (
                    <DropdownMenuItem onClick={() => handleExport("markdown")}>
                      Export Selected ({selectedItems.length})
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
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
                ? "Deselect All"
                : "Select All"}
            </Button>
            <span className="text-sm text-gray-500">
              {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>

          {selectedItems.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Delete Selected
            </Button>
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
            No items found
          </h3>
          <p className="text-gray-600">
            {searchTerm ||
            selectedTags.length > 0 ||
            selectedSubject ||
            dateFilter
              ? "Try adjusting your search or filters"
              : "Save questions and answers to see them here"}
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
                        {item.type === "question" ? "Question" : "Answer"}
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
                          Edit Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
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
                  View Full Content
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
            <DialogTitle>Edit Tags</DialogTitle>
            <DialogDescription>
              Add or remove tags to better organize your saved content.
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
                placeholder="Add a new tag"
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
                Add
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTags}>Save Changes</Button>
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
              {viewingItem?.type === "question" ? "Question" : "Answer"}
              {viewingItem?.subject && ` - ${viewingItem.subject}`}
            </DialogTitle>
            <DialogDescription>
              Created on{" "}
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
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
