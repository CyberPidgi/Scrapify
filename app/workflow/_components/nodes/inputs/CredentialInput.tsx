import React, { useId } from 'react'
import { InputProps } from '@/types/appNode'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { getCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';

const CredentialInput = ({ input, updateInputValue, value }: InputProps ) => {
  const id = useId();

  const query = useQuery({
    queryKey: ['credentials'],
    queryFn: () => getCredentialsForUser(),
    refetchInterval: 10000
  })
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label htmlFor={id} className='flex text-xs'>
        {input.name}
        {input.required && <span className='px-2 text-red-500'>*</span>}
      </Label>
      <Select onValueChange={(value) => updateInputValue(value)} defaultValue={value}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select an option'/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {
              query.data?.map((credential) => (
                <SelectItem key={credential.id} value={credential.id}>
                  {credential.name}
                </SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default CredentialInput
