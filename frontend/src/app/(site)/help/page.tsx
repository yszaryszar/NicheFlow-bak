'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TextArea } from '@/components/ui/input'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@/components/ui/collapse'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const faqs = [
  {
    question: '如何开始使用NicheFlow？',
    answer:
      '注册账号后，您可以选择适合的订阅方案开始使用。我们提供详细的新手指南和视频教程，帮助您快速上手。',
  },
  {
    question: '支持哪些内容平台？',
    answer:
      '目前我们支持主流社交媒体平台，包括微信公众号、抖音、小红书、知乎等。我们会持续增加更多平台的支持。',
  },
  {
    question: 'AI生成的内容是否原创？',
    answer:
      '是的，我们的AI模型经过专门训练，能够生成原创、独特的内容。每篇内容都会经过查重和优化，确保原创性。',
  },
  {
    question: '如何确保内容质量？',
    answer:
      '我们的AI模型会根据您的需求和目标受众生成内容，并提供人工审核和编辑功能，让您可以进一步优化内容质量。',
  },
  {
    question: '订阅方案可以更改吗？',
    answer:
      '是的，您可以随时升级或降级您的订阅方案。升级后即可立即使用新方案的功能，降级将在下个计费周期生效。',
  },
  {
    question: '提供企业定制服务吗？',
    answer:
      '是的，我们为企业用户提供定制化服务，包括专属功能开发、API集成、培训支持等。请联系我们的销售团队了解详情。',
  },
]

const formSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  message: z.string().min(10, '问题描述至少需要10个字符'),
})

type FormValues = z.infer<typeof formSchema>

export default function HelpPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log('提交的表单数据:', values)
    form.reset()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">帮助中心</h1>
        <p className="text-xl text-gray-600">查找常见问题的解答，或直接联系我们获取支持</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-8">常见问题</h2>
          <Collapse type="single" collapsible>
            {faqs.map((faq, index) => (
              <CollapseItem key={index} value={`item-${index}`}>
                <CollapseTrigger>{faq.question}</CollapseTrigger>
                <CollapseContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CollapseContent>
              </CollapseItem>
            ))}
          </Collapse>
          <div className="text-center mt-8">
            <p className="mb-4">没有找到您需要的答案？</p>
            <Button variant="link" asChild>
              <a href="#contact-form">联系我们获取帮助</a>
            </Button>
          </div>
        </div>

        <div>
          <Card className="p-6" id="contact-form">
            <h2 className="text-2xl font-bold mb-8">联系我们</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入您的姓名" {...field} />
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
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入您的邮箱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>问题描述</FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="请详细描述您遇到的问题"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  提交
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}
