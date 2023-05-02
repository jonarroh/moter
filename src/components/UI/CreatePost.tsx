import { useUser } from "@clerk/nextjs";
import { Button, TextInput } from "flowbite-react";
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
      if (!user.firstName) return;
      mutate({
        content: inputValue.current.value,
        authorName: user.firstName,
      });
    }
  };

  return (
    <div className="flex w-2/5 flex-row items-center justify-between py-2">
      <TextInput
        id="small"
        type="text"
        className="w-full"
        placeholder="¿Qué estás pensando?"
        sizing="sm"
        ref={inputValue}
        disabled={isLoading}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onKeyDown={(event) => handleKeyDown(event)}
      />
      <div>
        <Button
          outline={true}
          size="sm"
          gradientDuoTone="purpleToBlue"
          onClick={() =>
            mutate({
              content: inputValue.current?.value ?? "",
              authorName: user.firstName ?? "",
            })
          }
        >
          Publicar
        </Button>
      </div>
    </div>
  );
}

export default CreatePost;
