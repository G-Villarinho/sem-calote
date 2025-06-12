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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFriend, type CreateFriendResponse } from "@/api/create-friend";
import { queryKeys } from "@/lib/query-keys";
import type { GetAllFriendsResponse } from "@/api/get-all-friends";
import { isAxiosError } from "axios";

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
  const queryClient = useQueryClient();
  const form = useForm<CreateFriendFormValues>({
    resolver: zodResolver(CreateFriendFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function updateFriendsCache(newFriend: CreateFriendResponse) {
    const friendsQueryKey = queryKeys.friends.all();
    const previousFriends =
      queryClient.getQueryData<GetAllFriendsResponse[]>(friendsQueryKey);

    const updatedFriends = previousFriends
      ? [newFriend, ...previousFriends]
      : [newFriend];

    queryClient.setQueryData(friendsQueryKey, updatedFriends);
  }

  const { mutateAsync: createFriendFn } = useMutation({
    mutationFn: createFriend,
  });

  async function handleCreateFriend(values: CreateFriendFormValues) {
    await createFriendFn(values, {
      onSuccess: (newFriend) => {
        updateFriendsCache(newFriend);
        onOpenChange(false);
        toast.success("Friend created successfully!");
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          form.setError("email", {
            type: "manual",
            message: "There is already a friend with that email address.",
          });
        }
      },
    });
  }

  const { isSubmitting } = form.formState;

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
