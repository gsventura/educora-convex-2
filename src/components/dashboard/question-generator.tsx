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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function QuestionGenerator() {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  // Connect to Convex actions and mutations
  const generateQuestionAction = useAction(api.openai.generateQuestion);
  const saveQuestionMutation = useMutation(api.questions.saveQuestion);
  const generateQuestionsMutation = useMutation(
    api.questions.generateQuestions,
  );

  // Get subjects from Convex
  const subjects = useQuery(api.subjects.getAllSubjects);

  // Seed subjects if needed
  const seedSubjectsMutation = useMutation(api.subjects.seedSubjects);

  useEffect(() => {
    // Seed subjects when component mounts if they don't exist
    seedSubjectsMutation();
  }, [seedSubjectsMutation]);

  // Get user's credit information
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);

  const handleGenerate = async () => {
    if (!subject || !prompt) return;

    // Check if user has credits or an active subscription
    if (
      !userCreditInfo?.hasActiveSubscription &&
      (userCreditInfo?.credits || 0) <= 0
    ) {
      alert(
        "You have no credits remaining. Please upgrade your plan to continue.",
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      // Call the OpenAI action to generate a question
      const result = await generateQuestionAction({
        subject,
        difficulty,
        prompt,
        model: "gpt-4", // Using GPT-4 for better quality questions
      });

      // Set the generated content
      setGeneratedContent(result);

      // Also save to the database automatically
      const response = await generateQuestionsMutation({
        subject,
        difficulty,
        prompt,
        numQuestions: 1,
      });

      // Show remaining credits if user is on free plan
      if (!userCreditInfo?.hasActiveSubscription && response.remainingCredits) {
        console.log(`Credits remaining: ${response.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!generatedContent) return;
    setShowSaveDialog(true);
    // Initialize tags with subject and difficulty
    setSelectedTags([subject, difficulty]);
  };

  const handleConfirmSave = async () => {
    try {
      // Save the question to the database with selected tags
      await saveQuestionMutation({
        question: generatedContent,
        subject,
        tags: selectedTags,
      });

      // Close dialog without showing alert
      setShowSaveDialog(false);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question. Please try again.");
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Generator</CardTitle>
          <CardDescription>
            Create custom exam questions by specifying subject, difficulty
            level, and prompt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt or Topic</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the specific topic or concepts you want questions about"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={!subject || !prompt || isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Question"}
          </Button>
        </CardFooter>
      </Card>

      {isGenerating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Question</CardTitle>
            <CardDescription>ENEM-style question for {subject}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-white">
              <div className="whitespace-pre-line">{generatedContent}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGeneratedContent("")}>
              Clear
            </Button>
            <Button onClick={handleSaveQuestion}>Save Question</Button>
          </CardFooter>
        </Card>
      )}

      {/* Save Question Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Question</DialogTitle>
            <DialogDescription>
              Add tags to help organize and find this question later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 px-3 py-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a custom tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <Button onClick={addCustomTag} type="button" variant="outline">
                Add
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>Save Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
