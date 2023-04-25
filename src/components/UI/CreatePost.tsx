import { useUser } from "@clerk/nextjs";
import { Button, Label, TextInput } from "flowbite-react";

function CreatePost() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Label
        htmlFor="small"
        value={`Que piensas hoy ${user.firstName ?? ""}?`}
      />
      <TextInput id="small" type="text" sizing="sm" />
      <Button>Enviar</Button>
    </div>
  );
}

export default CreatePost;
