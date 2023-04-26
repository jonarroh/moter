import { useUser } from "@clerk/nextjs";
import { Button, Label, TextInput } from "flowbite-react";
import { useRef } from "react";
import { api } from "~/utils/api";

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
    <div className="flex flex-col items-center justify-center py-2">
      <Label
        htmlFor="small"
        className="mb-2 text-2xl font-bold text-white"
        value={`Que piensas hoy ${user.firstName ?? ""}?`}
      />
      <TextInput
        id="small"
        type="text"
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
