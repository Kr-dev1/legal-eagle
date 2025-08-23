"use client";

import React, { useState } from "react";
import FileUpload from "@/components/dropzone/dropzone";
import { Button } from "../ui/button";
import { useUploadThing } from "@/lib/utils";
import { Country, CountryDropdown } from "../ui/country-dropdown";
import { submitContract } from "./api/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UploadState = {
  contract: File[];
  userCountry: Country | null;
  orgCountry: Country | null;
};

const UploadFlow = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState<UploadState>({
    contract: [],
    userCountry: null,
    orgCountry: null,
  });
  const [loading, setLoading] = useState(false);

  const { startUpload } = useUploadThing("pdfUploader");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleUpload = (files: File[]) => {
    setUploads((prev) => ({ ...prev, contract: files }));
  };

  const handleSubmit = async () => {
    if (!uploads.userCountry || !uploads.orgCountry) {
      toast.error("Please select both user and organization countries");
      return;
    }

    setLoading(true);
    const file = await startUpload(uploads.contract);
    if (file && uploads) {
      try {
        const res = await submitContract({
          fileKey: file[0].key,
          fileUrl: file[0].ufsUrl,
          orgCountry: uploads.orgCountry,
          userCountry: uploads.userCountry,
        });
        if (res.success) {
          router.push(`/chat/${res.data}`);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong while submitting");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="w-full">
            <FileUpload
              onUpload={handleUpload}
              initialFiles={uploads.contract}
            />
            <div className="flex gap-4 justify-between mt-28">
              <Button disabled variant="outline">
                Back
              </Button>
              <Button
                disabled={uploads.contract.length === 0}
                onClick={nextStep}
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Your Country</h3>
                <CountryDropdown
                  defaultValue={uploads.userCountry?.alpha3}
                  placeholder="Select country"
                  onChange={(val) =>
                    setUploads((prev) => ({ ...prev, userCountry: val }))
                  }
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Organization Country</h3>
                <CountryDropdown
                  defaultValue={uploads.orgCountry?.alpha3}
                  placeholder="Select country"
                  onChange={(val) =>
                    setUploads((prev) => ({ ...prev, orgCountry: val }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 justify-between mt-46">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                className="px-6"
                onClick={nextStep}
                disabled={!uploads.userCountry || !uploads.orgCountry}
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">
              Review Your Submission
            </h2>

            <div className="mb-6 space-y-4">
              <div>
                <h3 className="font-medium">Contract File</h3>
                <p className="text-sm text-muted-foreground">
                  {uploads.contract[0]?.name || "No file uploaded"}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Selected Countries</h3>
                <p className="text-sm text-muted-foreground">
                  User: {uploads.userCountry?.name || "Not selected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Organization: {uploads.orgCountry?.name || "Not selected"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-between mt-19">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button className="px-6" onClick={() => handleSubmit()}>
                {loading ? <div>Submitting...</div> : "Submit"}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <h1 className="font-bold text-2xl">Analyse Contract</h1>
          <p className="text-sm font-semibold">
            Upload Contract that you want us to analyse
          </p>
        </div>
        <p className="text-sm font-semibold mb-2">
          {step === 0
            ? "Upload your contract"
            : step === 1
              ? "Select countries"
              : "Confirm your submission"}
        </p>
        {renderStep()}
      </div>
    </div>
  );
};

export default UploadFlow;
