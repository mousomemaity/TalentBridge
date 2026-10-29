"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MailCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setSentMessage(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <MailCheck className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Check Your Email</h2>
            <p className="mt-2 text-sm text-slate-600">
              We&apos;ve sent a verification link to your registered email address. Click the link to
              activate your TalentBridge account.
            </p>
          </div>

          {sentMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
              A fresh verification email has been dispatched!
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link href="/login">
              <Button className="w-full font-bold">Return to Sign In</Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="w-full text-xs font-semibold gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
