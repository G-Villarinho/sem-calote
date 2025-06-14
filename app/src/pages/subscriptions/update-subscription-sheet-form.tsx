import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { getOrdinalSuffix } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateSubscriptionResponse } from "@/api/create-subscription";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-keys";
import type { GetAllSubscriptionsResponse } from "@/api/get-all-subscriptions";
import { Loader2 } from "lucide-react";
import { updateSubscription } from "@/api/update-subscription";

const updateSubscriptionSchema = z.object({
  name: z.string().min(1, {
    message: "Service name is required.",
  }),
  totalPrice: z.coerce
    .number({ message: "Total price is required." })
    .positive({
      message: "Price must be a positive number.",
    }),
  dueDay: z.coerce
    .number({ message: "Due day is required." })
    .int()
    .min(1)
    .max(31),
});

type UpdateSubscriptionFormValues = z.infer<typeof updateSubscriptionSchema>;

const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

const daySelectItems = dayOptions.map((day) => (
  <SelectItem key={day} value={day.toString()}>
    {day}
    {getOrdinalSuffix(day)} of the month
  </SelectItem>
));

interface UpdateSubscriptionSheetFormProps {
  onClose: () => void;
  subscription: {
    id: string;
    name: string;
    total_price: number;
    due_day: number;
  };
}

export function UpdateSubscriptionSheetForm({
  onClose,
  subscription,
}: UpdateSubscriptionSheetFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateSubscriptionFormValues>({
    resolver: zodResolver(updateSubscriptionSchema),
    defaultValues: {
      name: subscription.name,
      totalPrice: subscription.total_price,
      dueDay: subscription.due_day,
    },
  });

  function updateSubscriptionOnCache(
    updatedSubscription: CreateSubscriptionResponse
  ) {
    queryClient.setQueryData<GetAllSubscriptionsResponse[]>(
      queryKeys.subscriptions.all(),
      (oldSubscriptions) => {
        if (!oldSubscriptions) return [updatedSubscription];
        return oldSubscriptions.map((sub) =>
          sub.id === updatedSubscription.id ? updatedSubscription : sub
        );
      }
    );
  }

  const { mutateAsync: updateSubscriptionMutation } = useMutation({
    mutationFn: updateSubscription,
  });

  async function onSubmit(values: UpdateSubscriptionFormValues) {
    const { name, totalPrice, dueDay } = values;

    await updateSubscriptionMutation(
      {
        subscriptionId: subscription.id,
        name,
        total_price: totalPrice,
        due_day: dueDay,
      },
      {
        onSuccess: (res) => {
          updateSubscriptionOnCache(res);
          onClose();
          toast.success("Subscription updated successfully!");
        },
      }
    );
  }

  const { isSubmitting } = form.formState;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4"
          id="update-subscription-form"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Subscription name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  This is the name of your subscription.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="19.99"
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
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Day</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select due day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    className="w-full min-w-[8rem] max-h-72 overflow-y-auto"
                  >
                    {daySelectItems}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the day of the month you will be billed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <SheetFooter className="flex flex-col">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="mb-2"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="update-subscription-form"
          disabled={isSubmitting}
        >
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
