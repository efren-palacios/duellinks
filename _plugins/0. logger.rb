
class MsgLogger
  def logToConsole(message, overwrite = false, newLine = false)
    if overwrite
      suffix = "\r"
    else
      suffix = "\n"
    end
    if newLine
      prefix = "\n"
    else
      prefix = ""
    end
    print(prefix + "[" + Time.now.strftime("%H:%M:%S:%L") + "] " + message + suffix)
  end

  def logObjectHandled(amount, object, action, overwrite = false, newLine = false)
    unless amount == 1
      logToConsole("  " + amount.to_s + " " + object + "s " + action, overwrite, newLine)
    else
      logToConsole("  1 " + object + " " + action, overwrite, newLine)
    end
  end

  def logDecksProcessed(amount)
    logObjectHandled(amount , "deck", "processed")
  end

  def logDecksGenerated(amount)
    logObjectHandled(amount , "deck", "generated")
  end

  def logProfileGenerated(amount)
    logObjectHandled(amount , "profile", "generated")
  end
end

$logger = MsgLogger.new
$posts_rendered = 1
$pages_rendered = 1
$pages_written = 1

Jekyll::Hooks.register :site, :pre_render do |site|
  $logger.logToConsole("Start rendering of site")
end

Jekyll::Hooks.register :posts, :post_render do |post|
  $logger.logObjectHandled($posts_rendered, "post", "rendered", true)
  $posts_rendered += 1
end

Jekyll::Hooks.register :pages, :post_render do |page|
  newLine = false
  if $pages_rendered == 1
    unless $posts_rendered == 1
      newLine = true
    end
  end
  $logger.logObjectHandled($pages_rendered, "page", "rendered", true, newLine)
  $pages_rendered += 1
end

Jekyll::Hooks.register :site, :post_render do |site|
  $logger.logToConsole("End rendering of site", false, true)
end

Jekyll::Hooks.register :pages, :post_write do |page|
  if $pages_written == 1
    $logger.logToConsole("Start writing of site")
  end

  $logger.logObjectHandled($pages_written, "page", "written", true)
  $pages_written += 1
end

Jekyll::Hooks.register :site, :post_write do |site|
  $logger.logToConsole("End writing of site", false, true)

  $posts_rendered = 1
  $pages_rendered = 1
  $pages_written = 1
end