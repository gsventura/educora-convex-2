import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Calendar,
  Clock,
  MoreVertical,
  Plus,
  BookOpen,
  Trash,
  Edit,
} from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudyPlan {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export function StudyPlans() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [planTitle, setPlanTitle] = useState("");
  const [savedPlans, setSavedPlans] = useState<StudyPlan[]>([
    {
      id: "1",
      title: "MCAT Biology Prep",
      content:
        "Week 1: Cell Biology\n- Day 1-2: Cell structure and function\n- Day 3-4: Cell metabolism\n- Day 5-7: Cell division and reproduction\n\nWeek 2: Genetics\n- Day 1-3: Mendelian genetics\n- Day 4-5: Molecular genetics\n- Day 6-7: Population genetics\n\nWeek 3: Human Physiology\n- Day 1-2: Nervous system\n- Day 3-4: Endocrine system\n- Day 5-7: Immune system\n\nWeek 4: Review and Practice\n- Day 1-3: Comprehensive content review\n- Day 4-7: Practice questions and mock exams",
      createdAt: new Date(2023, 4, 10),
    },
    {
      id: "2",
      title: "Linear Algebra Final Exam",
      content:
        "Week 1: Vectors and Matrices\n- Day 1-2: Vector operations and properties\n- Day 3-4: Matrix operations and properties\n- Day 5-7: Systems of linear equations\n\nWeek 2: Vector Spaces\n- Day 1-3: Subspaces and basis\n- Day 4-5: Linear independence\n- Day 6-7: Dimension and rank\n\nWeek 3: Eigenvalues and Eigenvectors\n- Day 1-3: Computing eigenvalues and eigenvectors\n- Day 4-5: Diagonalization\n- Day 6-7: Applications\n\nWeek 4: Final Review\n- Day 1-2: Comprehensive review of all topics\n- Day 3-5: Practice problems from each section\n- Day 6-7: Mock exams and final preparations",
      createdAt: new Date(2023, 6, 22),
    },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const generateStudyPlanAction = useAction(api.openai.generateStudyPlan);
  const saveStudyPlanMutation = useMutation(api.studyPlans.saveStudyPlan);

  // Get user's credit information
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);
  const generateStudyPlanMutation = useMutation(
    api.studyPlans.generateStudyPlan,
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

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
    setGeneratedPlan(null);

    try {
      // First call the Convex mutation to track credit usage
      const planResponse = await generateStudyPlanMutation({
        prompt,
      });

      // Call the OpenAI action to generate a study plan
      const result = await generateStudyPlanAction({
        prompt,
        model: "gpt-4", // Using GPT-4 for better quality study plans
      });

      setGeneratedPlan(result);

      // Show remaining credits if user is on free plan
      if (
        !userCreditInfo?.hasActiveSubscription &&
        planResponse.remainingCredits
      ) {
        console.log(`Credits remaining: ${planResponse.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
      alert("Failed to generate study plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan || !planTitle.trim()) return;

    try {
      // Save the study plan to the database
      await saveStudyPlanMutation({
        title: planTitle,
        content: generatedPlan,
        prompt: prompt,
      });

      // Add to local state for immediate UI update
      const newPlan: StudyPlan = {
        id: Date.now().toString(),
        title: planTitle,
        content: generatedPlan,
        createdAt: new Date(),
      };

      setSavedPlans((prev) => [newPlan, ...prev]);
      setShowSaveDialog(false);
      setGeneratedPlan(null);
      setPrompt("");
      setPlanTitle("");
    } catch (error) {
      console.error("Error saving study plan:", error);
      alert("Failed to save study plan. Please try again.");
    }
  };

  const deleteStudyPlanMutation = useMutation(api.studyPlans.deleteStudyPlan);

  const handleDeletePlan = async (id: string) => {
    try {
      // Delete from database if it's a real ID (not a local one)
      if (id.includes("_")) {
        await deleteStudyPlanMutation({
          planId: id as any, // Type assertion needed since we're mixing local and DB IDs
        });
      }

      // Update local state
      setSavedPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error("Error deleting study plan:", error);
      alert("Failed to delete study plan. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Plans</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Plan</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Study Plan</DialogTitle>
              <DialogDescription>
                Chat with AI to create a personalized study plan based on your
                goals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Describe your study goals, subject, timeline, and any specific areas you want to focus on..."
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isGenerating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {generatedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Study Plan</CardTitle>
            <CardDescription>
              Based on your goals and requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line">
              {generatedPlan}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
              Discard
            </Button>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button>Save Plan</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Study Plan</DialogTitle>
                  <DialogDescription>
                    Give your study plan a name to save it for future reference.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Study Plan Title"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSavePlan} disabled={!planTitle.trim()}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}

      {savedPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{plan.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>4 weeks</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-hidden relative">
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {plan.content.substring(0, 300)}
                    {plan.content.length > 300 && "..."}
                  </p>
                  {plan.content.length > 300 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View Full Plan</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {savedPlans.length === 0 && !generatedPlan && !isGenerating && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No study plans yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first personalized study plan to get started
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Study Plan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Plan</DialogTitle>
                <DialogDescription>
                  Chat with AI to create a personalized study plan based on your
                  goals.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Describe your study goals, subject, timeline, and any specific areas you want to focus on..."
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Plan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
