import { CardWrapper } from "./card-wrapper";
import { BsExclamationTriangle } from "react-icons/bs";

function ErrorCard({
}) {
    return (
       <CardWrapper
          headerLabel="Oops! Something went wrong"
          backButtonLabel="Back to login"
          backButtonHref="/auth/login"     
       >
        <div className="w-full flex justify-center items-center">
            <BsExclamationTriangle />
        </div>
       </CardWrapper>
    )
}

export default ErrorCard;