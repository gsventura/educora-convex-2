import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileQuestion, MessageSquare, BookOpen, Calendar } from "lucide-react";
import { QuestionGenerator } from "@/components/dashboard/question-generator";
import { AnswerAssistant } from "@/components/dashboard/answer-assistant";
import { SavedQuestions } from "@/components/dashboard/saved-questions";
import { StudyPlans } from "@/components/dashboard/study-plans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const subscription = useQuery(api.subscriptions.getUserSubscription);
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {userData?.name || user?.fullName || "Student"}!
            </p>
          </div>

          <Card className="w-full md:w-auto mt-4 md:mt-0">
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {subscription?.status === "active" ? "Active" : "Free Plan"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {subscription?.status === "active"
                      ? "Unlimited access"
                      : `${userCreditInfo?.credits || 0} credits remaining`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/not-subscribed")}
                >
                  {subscription?.status === "active" ? "Manage" : "Upgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="question-generator" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger
              value="question-generator"
              className="flex items-center gap-2"
            >
              <FileQuestion className="h-4 w-4" />
              <span className="hidden md:inline">Question Generator</span>
              <span className="inline md:hidden">Questions</span>
            </TabsTrigger>
            <TabsTrigger
              value="answer-assistant"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Answer Assistant</span>
              <span className="inline md:hidden">Answers</span>
            </TabsTrigger>
            <TabsTrigger
              value="saved-questions"
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Saved Questions</span>
              <span className="inline md:hidden">Saved</span>
            </TabsTrigger>
            <TabsTrigger
              value="study-plans"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Study Plans</span>
              <span className="inline md:hidden">Plans</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="question-generator" className="space-y-4">
            <QuestionGenerator />
          </TabsContent>

          <TabsContent value="answer-assistant" className="space-y-4">
            <AnswerAssistant />
          </TabsContent>

          <TabsContent value="saved-questions" className="space-y-4">
            <SavedQuestions />
          </TabsContent>

          <TabsContent value="study-plans" className="space-y-4">
            <StudyPlans />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
