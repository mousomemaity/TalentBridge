"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MOCK_OFFERS } from "@/lib/mock-data";
import { OfferItem } from "@/types";
import { Gift, CheckCircle2, XCircle, FileText, Download, Sparkles } from "lucide-react";

export default function CandidateOffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>(MOCK_OFFERS);
  const [activeOffer, setActiveOffer] = useState<OfferItem | null>(null);

  const handleDecision = (id: string, status: "accepted" | "declined") => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    setActiveOffer(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Offers</h1>
        <p className="text-xs text-slate-500">
          Review formal employment offers, compensation packages, and sign or decline agreements.
        </p>
      </div>

      <div className="space-y-4">
        {offers.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            No active offers currently pending.
          </Card>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id} className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/20 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{offer.jobTitle}</h3>
                      <Badge
                        variant={
                          offer.status === "accepted"
                            ? "success"
                            : offer.status === "declined"
                            ? "destructive"
                            : "purple"
                        }
                      >
                        {offer.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {offer.companyName}
                    </p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">
                      {offer.compensation}
                    </p>
                    <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-500">
                      <span>Target Start Date: {offer.startDate}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-medium">Response Deadline: {offer.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveOffer(offer)}
                    className="text-xs font-semibold gap-1.5"
                  >
                    <FileText className="h-4 w-4" /> View Full Offer
                  </Button>
                  {offer.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleDecision(offer.id, "accepted")}
                      className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Accept Offer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Offer Letter Preview Dialog */}
      <Dialog open={!!activeOffer} onOpenChange={() => setActiveOffer(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Formal Offer Package</DialogTitle>
            <DialogDescription>
              {activeOffer?.companyName} • {activeOffer?.jobTitle}
            </DialogDescription>
          </DialogHeader>

          {activeOffer && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">
                  Dear Alex Rivera,
                </p>
                <p className="text-slate-600 leading-relaxed">
                  On behalf of {activeOffer.companyName}, we are thrilled to offer you the position of{" "}
                  <strong>{activeOffer.jobTitle}</strong>. Your background in modern Next.js and React 19 architecture makes you an exceptional addition to our engineering organization.
                </p>
                <div className="pt-2 border-t border-slate-200 mt-2 space-y-1">
                  <p><strong>Base Compensation:</strong> {activeOffer.compensation}</p>
                  <p><strong>Target Start:</strong> {activeOffer.startDate}</p>
                  <p><strong>Offer Validity:</strong> {activeOffer.deadline}</p>
                </div>
              </div>

              {activeOffer.status === "pending" && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDecision(activeOffer.id, "declined")}
                    className="text-red-600 hover:bg-red-50 text-xs font-semibold"
                  >
                    Decline Offer
                  </Button>
                  <Button
                    onClick={() => handleDecision(activeOffer.id, "accepted")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Accept & E-Sign
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
