class SectionsController < ApplicationController
  def index
    @sections = Project.sections.all
  end
end
