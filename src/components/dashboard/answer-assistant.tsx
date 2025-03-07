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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Upload, Image, FileText } from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function AnswerAssistant() {
  const [questionText, setQuestionText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [answer, setAnswer] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<"text" | "image">("text");

  const generateAnswerAction = useAction(api.openai.generateAnswer);
  const saveAnswerMutation = useMutation(api.answers.saveAnswer);

  // Get user's credit information
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);
  const generateAnswerMutation = useMutation(api.answers.generateAnswer);

  const handleTextSubmit = async () => {
    if (!questionText.trim()) return;

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

    setIsProcessing(true);
    setAnswer("");

    try {
      // First call the Convex mutation to track credit usage
      const answerResponse = await generateAnswerMutation({
        questionText,
        imageUrl: null,
      });

      // Then call the OpenAI action to generate the actual answer
      const result = await generateAnswerAction({
        questionText,
        model: "gpt-4", // Using GPT-4 for better quality answers
      });

      setAnswer(result);

      // Show remaining credits if user is on free plan
      if (
        !userCreditInfo?.hasActiveSubscription &&
        answerResponse.remainingCredits
      ) {
        console.log(`Credits remaining: ${answerResponse.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error generating answer:", error);
      alert("Failed to generate answer. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!uploadedImage) return;

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

    setIsProcessing(true);
    setAnswer("");

    try {
      // First call the Convex mutation to track credit usage
      const answerResponse = await generateAnswerMutation({
        questionText: "Image-based question",
        imageUrl: uploadedImage,
      });

      // Simulate API call with timeout
      setTimeout(() => {
        const mockAnswer =
          "Based on the image you uploaded, I can see this is a question about mathematical principles. The solution requires applying the correct formula and calculating step by step.\n\nFirst, we need to understand what the question is asking. It appears to be asking about calculating a specific value using the given information.\n\nThe correct approach would be to use the formula relevant to this type of problem, substitute the values, and solve for the unknown variable.\n\nThe answer is...";

        setAnswer(mockAnswer);
        setIsProcessing(false);

        // Show remaining credits if user is on free plan
        if (
          !userCreditInfo?.hasActiveSubscription &&
          answerResponse.remainingCredits
        ) {
          console.log(`Credits remaining: ${answerResponse.remainingCredits}`);
        }
      }, 2000);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (inputMethod === "text") {
      handleTextSubmit();
    } else {
      handleImageSubmit();
    }
  };

  const handleSaveAnswer = async () => {
    try {
      // Save the answer to the database
      await saveAnswerMutation({
        questionText,
        answer,
        tags: ["answer"],
      });

      // Don't show success message
    } catch (error) {
      console.error("Error saving answer:", error);
      alert("Failed to save answer. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Answer Assistant</CardTitle>
          <CardDescription>
            Upload question text or images to receive AI-generated explanations
            and corrections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={inputMethod}
            onValueChange={(value) => setInputMethod(value as "text" | "image")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 pt-4">
              <Textarea
                placeholder="Enter your question or problem here..."
                rows={6}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="image" className="space-y-4 pt-4">
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                {uploadedImage ? (
                  <div className="space-y-4 w-full">
                    <img
                      src={uploadedImage}
                      alt="Uploaded question"
                      className="max-h-64 mx-auto object-contain rounded-lg"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setUploadedImage(null)}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop an image, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        asChild
                      >
                        <span>Upload Image</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              inputMethod === "text"
                ? !questionText.trim()
                : !uploadedImage || isProcessing
            }
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Get Answer"}
          </Button>
        </CardFooter>
      </Card>

      {isProcessing && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>Answer & Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line">
              {answer}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setAnswer("")}>
              Clear
            </Button>
            <Button onClick={handleSaveAnswer}>Save Answer</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
