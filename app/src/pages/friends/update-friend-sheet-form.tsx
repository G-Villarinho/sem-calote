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
import { queryKeys } from "@/lib/query-keys";
import type { GetAllFriendsResponse } from "@/api/get-all-friends";
import { isAxiosError } from "axios";
import { updateFriend, type UpdateFriendResponse } from "@/api/update-friend";

const UpdateFriendFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type UpdateFriendFormValues = z.infer<typeof UpdateFriendFormSchema>;

interface UpdateFriendSheetFormProps {
  onOpenChange: (open: boolean) => void;
  friend: {
    id: string;
    name: string;
    email: string;
  };
}

export function UpdateFriendSheetForm({
  onOpenChange,
  friend,
}: UpdateFriendSheetFormProps) {
  console.log("UpdateFriendSheetForm rendered with friend:", friend);
  const queryClient = useQueryClient();
  const form = useForm<UpdateFriendFormValues>({
    resolver: zodResolver(UpdateFriendFormSchema),
    defaultValues: {
      name: friend.name,
      email: friend.email,
    },
  });

  function updateFriendsCache(updatedFriend: UpdateFriendResponse) {
    const friendsQueryKey = queryKeys.friends.all();

    queryClient.setQueryData<GetAllFriendsResponse[]>(
      friendsQueryKey,
      (oldData) => {
        if (!oldData) {
          return [];
        }

        return oldData.map((cachedFriend) =>
          cachedFriend.id === updatedFriend.id
            ? { ...cachedFriend, ...updatedFriend }
            : cachedFriend
        );
      }
    );
  }

  const { mutateAsync: updateFriendFn } = useMutation({
    mutationFn: updateFriend,
  });

  async function handleUpdateFriend(values: UpdateFriendFormValues) {
    await updateFriendFn(
      { friendId: friend.id, ...values },
      {
        onSuccess: (newFriend) => {
          updateFriendsCache(newFriend);
          onOpenChange(false);
          toast.success("Friend updated successfully!");
        },
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 409) {
            form.setError("email", {
              type: "manual",
              message: "There is already a friend with that email address.",
            });
          }
        },
      }
    );
  }

  const { isSubmitting } = form.formState;

  return (
    <>
      <Form {...form}>
        <form
          id="update-friend-form"
          onSubmit={form.handleSubmit(handleUpdateFriend)}
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
        <Button type="submit" disabled={isSubmitting} form="update-friend-form">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </SheetFooter>
    </>
  );
}
