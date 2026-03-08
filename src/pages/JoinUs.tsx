import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Award, Globe, Briefcase, Heart, BookOpen,
  Upload, CheckCircle2, ArrowRight, Star, TrendingUp
} from "lucide-react";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  experience: z.string().max(1000).optional(),
  availability: z.string().min(1, "Please select availability"),
  whyJoinUs: z.string().min(50, "Please write at least 50 characters").max(2000),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const skillOptions = [
  "Content Writing",
  "Graphic Design",
  "Video Editing",
  "Social Media",
  "Web Development",
  "Data Analysis",
  "Public Speaking",
  "Translation",
  "Community Outreach",
  "Research",
];

const availabilityOptions = [
  "Full-time (40+ hrs/week)",
  "Part-time (20-40 hrs/week)",
  "Weekends only",
  "Flexible (5-20 hrs/week)",
  "Project-based",
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Gain real-world experience in civic tech, public policy, and digital media that stands out on any resume.",
  },
  {
    icon: Users,
    title: "Network Building",
    desc: "Connect with professionals from diverse fields — policy makers, journalists, technologists, and social workers.",
  },
  {
    icon: Award,
    title: "Recognition & Certificates",
    desc: "Receive official certificates and letters of recommendation for your valuable contributions.",
  },
  {
    icon: Globe,
    title: "National Impact",
    desc: "Your work directly impacts millions of Indian voters — a meaningful addition to your portfolio.",
  },
  {
    icon: Briefcase,
    title: "Skill Development",
    desc: "Learn content creation, data visualization, project management, and civic engagement strategies.",
  },
  {
    icon: Heart,
    title: "Purpose-Driven Work",
    desc: "Be part of a mission to strengthen Indian democracy — work that truly matters.",
  },
];

const JoinUsPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      skills: [],
      availability: "",
    },
  });

  const handleSkillToggle = (skill: string) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(updated);
    setValue("skills", updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF or DOC/DOCX",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(fileName);

        resumeUrl = urlData.publicUrl;
      }

      // Insert application
      const { error: insertError } = await supabase
        .from("volunteer_applications")
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          skills: data.skills,
          experience: data.experience || null,
          availability: data.availability,
          why_join_us: data.whyJoinUs,
          resume_url: resumeUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      reset();
      setSelectedSkills([]);
      setResumeFile(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-background/20 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-background/10 blur-3xl" />
        </div>
        <div className="container relative z-10 max-w-4xl text-center">
          <span className="inline-block text-sm font-semibold text-background/60 uppercase tracking-[0.2em] mb-4">
            Join Our Team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-background leading-tight">
            Be Part of India's
            <br />
            <span className="text-background/70">Civic Revolution</span>
          </h1>
          <p className="mt-6 text-background/60 text-lg max-w-2xl mx-auto">
            Join Matdaan's mission to empower 950 million voters. Whether you're a student, professional, or passionate citizen — there's a place for you here.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Why Join Us
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              Benefits of Working with Matdaan
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <Card
                key={i}
                className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-6 w-6 text-background" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container max-w-3xl">
          <Card className="shadow-elevated">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl font-display">
                Apply to Join Matdaan
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Fill out the form below. We review every application carefully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <Label>Skills & Expertise *</Label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          selectedSkills.includes(skill)
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="text-sm text-destructive">{errors.skills.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Relevant Experience (optional)
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Briefly describe any relevant work, internships, or projects..."
                    className="min-h-[100px]"
                    {...register("experience")}
                  />
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <Label>Availability *</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {availabilityOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-foreground cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          value={option}
                          {...register("availability")}
                          className="accent-foreground"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && (
                    <p className="text-sm text-destructive">{errors.availability.message}</p>
                  )}
                </div>

                {/* Why Join */}
                <div className="space-y-2">
                  <Label htmlFor="whyJoinUs">
                    Why do you want to join Matdaan? *
                  </Label>
                  <Textarea
                    id="whyJoinUs"
                    placeholder="Tell us about your motivation, what you hope to contribute, and what you'd like to learn..."
                    className="min-h-[150px]"
                    {...register("whyJoinUs")}
                  />
                  {errors.whyJoinUs && (
                    <p className="text-sm text-destructive">{errors.whyJoinUs.message}</p>
                  )}
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV (PDF or DOC, max 5MB)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-foreground transition-colors">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      {resumeFile ? (
                        <span className="text-sm font-medium text-foreground">
                          {resumeFile.name}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default JoinUsPage;
