import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const CreateFriendFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type CreateFriendFormValues = z.infer<typeof CreateFriendFormSchema>;

interface CreateFriendSheetFormProps {
  onOpenChange: (open: boolean) => void;
}

export function CreateFriendSheetForm({
  onOpenChange,
}: CreateFriendSheetFormProps) {
  const form = useForm<CreateFriendFormValues>({
    resolver: zodResolver(CreateFriendFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleCreateFriend(values: CreateFriendFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Friend created:", values);

    form.reset();
    onOpenChange(false);
    toast.success("Friend added successfully!");
  }

  return (
    <>
      <Form {...form}>
        <form
          id="create-friend-form"
          onSubmit={form.handleSubmit(handleCreateFriend)}
          className="space-y-6 pt-6 p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <SheetFooter className="pt-4">
        <SheetClose asChild>
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Cancel
          </Button>
        </SheetClose>
        <Button type="submit" disabled={isSubmitting} form="create-friend-form">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Friend"
          )}
        </Button>
      </SheetFooter>
    </>
  );
}
