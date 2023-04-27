import { useUser } from "@clerk/nextjs";
import { Button, Label, TextInput } from "flowbite-react";
import { useRef } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

function CreatePost() {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: () => {
      if (inputValue.current) {
        inputValue.current.value = "";
      }
      void ctx.post.getAll.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong 😢");
    },
  });
  const inputValue = useRef<HTMLInputElement>(null);
  if (!user) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!inputValue.current?.value) return;
      mutate({
        content: inputValue.current.value,
      });
    }
  };

  return (
    <div className="flex flex-row items-center justify-center py-2">
      <TextInput
        id="small"
        type="text"
        placeholder="¿Qué estás pensando?"
        sizing="sm"
        ref={inputValue}
        disabled={isLoading}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onKeyDown={(event) => handleKeyDown(event)}
      />
      <Button
        outline={true}
        gradientDuoTone="purpleToBlue"
        onClick={() =>
          mutate({
            content: inputValue.current?.value ?? "",
          })
        }
      >
        Publicar
      </Button>
    </div>
  );
}

export default CreatePost;
