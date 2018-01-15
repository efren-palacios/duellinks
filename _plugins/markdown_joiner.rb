module Jekyll
  class MarkdownTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end
    require "kramdown"
    require 'jekyll'
    def render(context)
      tmpl = File.read File.join Dir.pwd, "_posts", @text
    end
  end
end
Liquid::Template.register_tag('markdown', Jekyll::MarkdownTag)