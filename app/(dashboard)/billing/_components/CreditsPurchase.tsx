'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Coins, CreditCard } from 'lucide-react'
import { CreditsPack, PackId } from '@/types/billing'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { purchaseCredits } from '@/actions/billing/purchaseCredits'

const CreditsPurchase = () => {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM)

  const mutation = useMutation({
    mutationFn: purchaseCredits,
    onSuccess: () => {
      toast.success('Credits purchased successfully')
    },
    onError: error => {
      toast.error('Something went wrong.')
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 font-bold text-2xl'>
          <Coins className='w-6 h-6 text-primary' />
          Purchase Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={value => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPack.map(pack => (
            <div
              key={pack.id}
              className='flex items-center space-x-3 bg-secondary/50 hover:bg-secondary rounded-lg'
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className='flex justify-between items-center w-full cursor-pointer'>
                <span className='font-medium'>
                  {pack.name} - {pack.label}
                </span>
                <span className='font-bold text-primary'>
                  ${(pack.price / 100).toFixed(2)} USD
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          disabled={mutation.isPending}
          className='w-full sm:w-auto'
          onClick={() => mutation.mutate(selectedPack)}
        >
          <CreditCard className='mr-2 w-5 h-5' />
          Purchase Credits
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CreditsPurchase
