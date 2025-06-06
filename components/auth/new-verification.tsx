"use client"

import {BeatLoader} from "react-spinners"

import { CardWrapper } from "./card-wrapper"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

const NewVerificationForm = () => {
    const searchParams =  useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if(success || error) return;

        if(!token) {
            setError("Missing token");
            return;
        }

        newVerification(token).then((data) => {
            setSuccess(data.success || null);
            setError(data.error || null);
        }).catch((error) => {
            console.log(error);
            setError("Something went wrong");
        })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                <FormSuccess message={success || ""} />
                {!success && (
                    <FormError message={error || ""} />
                )}
            </div>
        </CardWrapper>
    )
}

export default NewVerificationForm